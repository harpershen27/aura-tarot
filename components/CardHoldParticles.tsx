"use client";

import { motion } from "framer-motion";

interface CardHoldParticlesProps {
  progress: number;
  width: number;
  height: number;
}

const HORIZONTAL_COUNT = 14;
const DEPTH_COUNT = 10;

export default function CardHoldParticles({
  progress,
  width,
  height,
}: CardHoldParticlesProps) {
  const radius = Math.max(width, height) * 0.62;
  const depthRadius = Math.max(width, height) * 0.48;
  const intensity = 0.4 + progress * 0.6;

  return (
    <div
      className="pointer-events-none absolute left-1/2 top-1/2"
      style={{
        width: 0,
        height: 0,
        transformStyle: "preserve-3d",
        perspective: 700,
        opacity: intensity,
      }}
    >
      <motion.div
        style={{ transformStyle: "preserve-3d" }}
        animate={{ rotateY: 360 }}
        transition={{ duration: 2.6, repeat: Infinity, ease: "linear" }}
      >
        {Array.from({ length: HORIZONTAL_COUNT }, (_, i) => {
          const angle = (360 / HORIZONTAL_COUNT) * i;
          return (
            <span
              key={`h-${i}`}
              className="absolute block rounded-full bg-[#e8c547]"
              style={{
                width: 4,
                height: 4,
                marginLeft: -2,
                marginTop: -2,
                boxShadow:
                  "0 0 8px rgba(232,197,71,0.95), 0 0 16px rgba(201,162,39,0.45)",
                transformStyle: "preserve-3d",
                transform: `rotateY(${angle}deg) translateZ(${radius}px)`,
              }}
            />
          );
        })}
      </motion.div>

      <motion.div
        style={{
          transformStyle: "preserve-3d",
          transform: "rotateX(28deg)",
        }}
        animate={{ rotateY: -360 }}
        transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
      >
        {Array.from({ length: DEPTH_COUNT }, (_, i) => {
          const angle = (360 / DEPTH_COUNT) * i + 18;
          return (
            <span
              key={`d-${i}`}
              className="absolute block rounded-full bg-[#c4a8ff]"
              style={{
                width: 3,
                height: 3,
                marginLeft: -1.5,
                marginTop: -1.5,
                boxShadow: "0 0 6px rgba(196,168,255,0.9)",
                transformStyle: "preserve-3d",
                transform: `rotateY(${angle}deg) translateZ(${depthRadius}px)`,
              }}
            />
          );
        })}
      </motion.div>
    </div>
  );
}
