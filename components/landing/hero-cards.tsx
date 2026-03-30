"use client";

import { useRef, useState } from "react";
import Image from "next/image";

export function HeroCards() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const [isHovering, setIsHovering] = useState(false);

  function handleMouseMove(e: React.MouseEvent<HTMLDivElement>) {
    const el = containerRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    const dx = (e.clientX - cx) / (rect.width / 2);
    const dy = (e.clientY - cy) / (rect.height / 2);
    setTilt({ x: -dy * 12, y: dx * 12 });
  }

  function handleMouseLeave() {
    setIsHovering(false);
    setTilt({ x: 0, y: 0 });
  }

  function handleMouseEnter() {
    setIsHovering(true);
  }

  return (
    <div className="relative flex justify-center lg:justify-end pt-4 sm:pt-0">
      <div
        ref={containerRef}
        onMouseMove={handleMouseMove}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        className="relative w-full max-w-md h-72 select-none"
        style={{ perspective: "1000px" }}
      >
        {/* Gold card — behind */}
        <div
          className="absolute"
          style={{
            top: "2rem",
            left: "3.5rem",
            zIndex: 1,
            transform: `
              perspective(1000px)
              rotateX(${tilt.x * 0.8}deg)
              rotateY(${tilt.y * 0.8 + 6}deg)
              translateZ(${isHovering ? -20 : -30}px)
            `,
            transition: isHovering
              ? "transform 0.1s ease-out"
              : "transform 0.6s ease-out",
          }}
        >
          <Image
            src="/gold-card.png"
            alt="Amex Gold Card"
            width={380}
            height={240}
            className="rounded-xl shadow-xl"
            draggable={false}
          />
          {/* Gloss sheen */}
          <div
            className="absolute inset-0 rounded-xl pointer-events-none"
            style={{
              background: `radial-gradient(ellipse at ${50 + tilt.y * 3}% ${50 - tilt.x * 3}%, rgba(255,255,255,0.18) 0%, transparent 70%)`,
              transition: isHovering
                ? "background 0.1s ease-out"
                : "background 0.6s ease-out",
            }}
          />
        </div>

        {/* Platinum card — front */}
        <div
          className="absolute"
          style={{
            top: 0,
            left: 0,
            zIndex: 2,
            transform: `
              perspective(1000px)
              rotateX(${tilt.x}deg)
              rotateY(${tilt.y - 6}deg)
              translateZ(${isHovering ? 20 : 0}px)
            `,
            transition: isHovering
              ? "transform 0.1s ease-out"
              : "transform 0.6s ease-out",
          }}
        >
          <Image
            src="/platinum-card.png"
            alt="Amex Platinum Card"
            width={380}
            height={240}
            className="rounded-xl shadow-2xl"
            priority
            draggable={false}
          />
          {/* Gloss sheen */}
          <div
            className="absolute inset-0 rounded-xl pointer-events-none"
            style={{
              background: `radial-gradient(ellipse at ${50 + tilt.y * 3}% ${50 - tilt.x * 3}%, rgba(255,255,255,0.22) 0%, transparent 65%)`,
              transition: isHovering
                ? "background 0.1s ease-out"
                : "background 0.6s ease-out",
            }}
          />
        </div>
      </div>
    </div>
  );
}
