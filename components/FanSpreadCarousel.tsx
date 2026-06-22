"use client";

import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import type { TarotCard } from "@/lib/types";
import { CARD_BACK_IMAGE, CARD_WIDTH, CARD_HEIGHT } from "@/lib/card-ring";

interface FanSpreadCarouselProps {
  cards: TarotCard[];
  isLocked: boolean;
  onCardClick: (card: TarotCard) => void;
}

export default function FanSpreadCarousel({
  cards,
  isLocked,
  onCardClick,
}: FanSpreadCarouselProps) {
  const count = cards?.length ?? 0;
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  const fanAngle = 120;
  const startAngle = -fanAngle / 2;
  const cardSpacing = fanAngle / Math.max(count - 1, 1);

  const cardStyles = useMemo(() => {
    return cards.map((_, index) => {
      const angle = startAngle + index * cardSpacing;
      const angleRad = (angle * Math.PI) / 180;
      const radius = 300;
      
      const x = Math.sin(angleRad) * radius;
      const y = -Math.cos(angleRad) * radius * 0.25;

      return {
        x,
        y,
        zIndex: Math.round(Math.cos(angleRad) * 100),
        opacity: 0.5 + Math.cos(angleRad) * 0.5,
        scale: 0.82 + Math.cos(angleRad) * 0.18,
      };
    });
  }, [cards, startAngle, cardSpacing]);

  if (count === 0) {
    return (
      <div className="flex flex-1 items-center justify-center text-sm text-[#6b4c9a]">
        所有卡牌已选完
      </div>
    );
  }

  return (
    <div className="relative flex flex-1 items-center justify-center overflow-hidden">
      <div className="relative">
        {cards.map((card, index) => {
          const style = cardStyles[index];
          const isHovered = hoveredIndex === index;
          
          return (
            <motion.button
              key={card.id}
              onClick={() => !isLocked && onCardClick(card)}
              disabled={isLocked}
              className="absolute cursor-pointer"
              onMouseEnter={() => !isLocked && setHoveredIndex(index)}
              onMouseLeave={() => !isLocked && setHoveredIndex(null)}
              initial={{ x: style.x, y: style.y, opacity: style.opacity, scale: style.scale }}
              animate={{
                x: style.x + (isHovered ? 0 : 0),
                y: style.y + (isHovered ? -20 : 0),
                opacity: isHovered ? 1 : style.opacity,
                scale: isHovered ? style.scale * 1.15 : style.scale,
              }}
              transition={{ type: "spring", stiffness: 200, damping: 25, duration: 0.3 }}
              style={{
                width: CARD_WIDTH,
                height: CARD_HEIGHT,
                left: `calc(50% - ${CARD_WIDTH / 2}px)`,
                top: `calc(50% - ${CARD_HEIGHT / 2}px)`,
                zIndex: style.zIndex + (isHovered ? 100 : 0),
              }}
            >
              <div className="relative w-full h-full rounded-lg overflow-hidden shadow-lg border border-[#c9a227]/30 bg-[#1a1028]">
                <Image
                  src={CARD_BACK_IMAGE}
                  alt="Card back"
                  fill
                  className="object-cover"
                  draggable={false}
                />
                
                {isHovered && !isLocked && (
                  <motion.div
                    className="absolute inset-0 rounded-lg border-2 border-[#c9a227] pointer-events-none"
                    initial={{ boxShadow: "0 0 10px rgba(201, 162, 39, 0.3)" }}
                    animate={{
                      boxShadow: [
                        "0 0 15px rgba(201, 162, 39, 0.4)",
                        "0 0 30px rgba(201, 162, 39, 0.6)",
                        "0 0 15px rgba(201, 162, 39, 0.4)",
                      ],
                    }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                  />
                )}
              </div>
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}