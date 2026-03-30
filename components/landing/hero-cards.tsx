"use client";

import { useRef, useState } from "react";

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

  const easing = isHovering ? "0.1s ease-out" : "0.6s ease-out";
  const glossPos = `${50 + tilt.y * 3}% ${50 - tilt.x * 3}%`;

  return (
    <div className="relative flex justify-center lg:justify-end pt-4 sm:pt-0">
      <div
        ref={containerRef}
        onMouseMove={handleMouseMove}
        onMouseEnter={() => setIsHovering(true)}
        onMouseLeave={handleMouseLeave}
        className="relative w-full max-w-md h-72 select-none"
        style={{ perspective: "1000px" }}
      >
        {/* Gold card — behind */}
        <div
          className="absolute inset-0"
          style={{
            zIndex: 1,
            transform: `
              perspective(1000px)
              rotateX(${tilt.x * 0.8}deg)
              rotateY(${tilt.y * 0.8 + 6}deg)
              translateZ(${isHovering ? -20 : -30}px)
              translate(3.5rem, 2rem)
            `,
            transition: `transform ${easing}`,
          }}
        >
          {/* Plain img — no wrapper stacking context */}
          <img
            src="/gold-card.png"
            alt="Amex Gold Card"
            width={380}
            height={240}
            draggable={false}
            className="rounded-xl shadow-xl"
            style={{ display: "block", background: "transparent" }}
          />
          <div
            className="absolute inset-0 rounded-xl pointer-events-none"
            style={{
              background: `radial-gradient(ellipse at ${glossPos}, rgba(255,255,255,0.18) 0%, transparent 70%)`,
              transition: `background ${easing}`,
            }}
          />
        </div>

        {/* Platinum card — front */}
        <div
          className="absolute inset-0"
          style={{
            zIndex: 2,
            transform: `
              perspective(1000px)
              rotateX(${tilt.x}deg)
              rotateY(${tilt.y - 6}deg)
              translateZ(${isHovering ? 20 : 0}px)
            `,
            transition: `transform ${easing}`,
          }}
        >
          <img
            src="/platinum-card.png"
            alt="Amex Platinum Card"
            width={380}
            height={240}
            draggable={false}
            className="rounded-xl shadow-2xl"
            style={{ display: "block", background: "transparent" }}
          />
          <div
            className="absolute inset-0 rounded-xl pointer-events-none"
            style={{
              background: `radial-gradient(ellipse at ${glossPos}, rgba(255,255,255,0.22) 0%, transparent 65%)`,
              transition: `background ${easing}`,
            }}
          />
        </div>
      </div>
    </div>
  );
}
