export function isAdmin(clerkId: string): boolean {
  const adminIds =
    process.env.ADMIN_USER_IDS?.split(",").map((id) => id.trim()) ?? [];
  return adminIds.includes(clerkId);
}
