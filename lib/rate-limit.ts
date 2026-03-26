import { Redis } from "@upstash/redis";

const WINDOW_SECONDS = 60;
const MAX_REQUESTS = 5;

let _redis: Redis | null = null;

function getRedis(): Redis | null {
  if (_redis) return _redis;
  const url = process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN;
  if (!url || !token) return null;
  _redis = new Redis({ url, token });
  return _redis;
}

// In-memory fallback for local dev or when Redis is not configured
const memStore = new Map<string, { count: number; resetAt: number }>();

// Periodic cleanup of stale entries to prevent memory leak
let lastCleanup = Date.now();
function cleanupMemStore() {
  const now = Date.now();
  if (now - lastCleanup < 300_000) return; // every 5 min
  lastCleanup = now;
  for (const [key, entry] of memStore) {
    if (entry.resetAt < now) memStore.delete(key);
  }
}

async function rateLimitRedis(
  ip: string
): Promise<{ ok: boolean; remaining: number }> {
  const redis = getRedis()!;
  const key = `rl:${ip}`;
  const count = await redis.incr(key);
  if (count === 1) {
    await redis.expire(key, WINDOW_SECONDS);
  }
  if (count > MAX_REQUESTS) {
    return { ok: false, remaining: 0 };
  }
  return { ok: true, remaining: MAX_REQUESTS - count };
}

function rateLimitMemory(ip: string): { ok: boolean; remaining: number } {
  cleanupMemStore();
  const now = Date.now();
  const entry = memStore.get(ip);

  if (!entry || entry.resetAt < now) {
    memStore.set(ip, { count: 1, resetAt: now + WINDOW_SECONDS * 1000 });
    return { ok: true, remaining: MAX_REQUESTS - 1 };
  }

  entry.count++;
  if (entry.count > MAX_REQUESTS) {
    return { ok: false, remaining: 0 };
  }

  return { ok: true, remaining: MAX_REQUESTS - entry.count };
}

export function getClientIp(request: Request): string {
  return (
    request.headers.get("x-real-ip") ??
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
    "unknown"
  );
}

export async function rateLimit(
  ip: string
): Promise<{ ok: boolean; remaining: number }> {
  if (getRedis()) {
    return rateLimitRedis(ip);
  }
  return rateLimitMemory(ip);
}

export function getRateLimitResponse() {
  return Response.json(
    { error: "Too many requests. Please try again later." },
    { status: 429 }
  );
}
