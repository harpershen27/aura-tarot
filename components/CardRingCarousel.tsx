"use client";

import { useCallback, useMemo, useRef, useState } from "react";
import Image from "next/image";

import type { TarotCard } from "@/lib/types";
import {
  CARD_BACK_IMAGE,
  CARD_HEIGHT,
  CARD_WIDTH,
  DRAG_SENSITIVITY,
  DRAG_THRESHOLD_PX,
  getCardVisuals,
  getFocusedIndex,
  INERTIA_FRICTION,
  INERTIA_MIN_VELOCITY,
  RING_RADIUS,
  RING_TILT_X,
  snapRotation,
} from "@/lib/card-ring";

interface CardRingCarouselProps {
  cards: TarotCard[];
  isLocked: boolean;
  onCardSelect: (card: TarotCard) => void;
}

export default function CardRingCarousel({
  cards,
  isLocked,
  onCardSelect,
}: CardRingCarouselProps) {
  const [rotation, setRotation] = useState(0);
  const rotationRef = useRef(0);
  const pointerStartX = useRef(0);
  const lastPointerX = useRef(0);
  const lastPointerTime = useRef(0);
  const velocityRef = useRef(0);
  const isDraggingRef = useRef(false);
  const isPointerDownRef = useRef(false);
  const inertiaFrameRef = useRef<number | null>(null);
  const snapFrameRef = useRef<number | null>(null);

  const count = cards?.length ?? 0;
  const focusedIndex = useMemo(
    () => getFocusedIndex(rotation, count),
    [rotation, count],
  );
  const focusedCard = cards[focusedIndex];

  const cancelAnimation = useCallback(() => {
    if (inertiaFrameRef.current !== null) {
      cancelAnimationFrame(inertiaFrameRef.current);
      inertiaFrameRef.current = null;
    }
    if (snapFrameRef.current !== null) {
      cancelAnimationFrame(snapFrameRef.current);
      snapFrameRef.current = null;
    }
  }, []);

  const applyRotation = useCallback((value: number) => {
    rotationRef.current = value;
    setRotation(value);
  }, []);

  const animateSnap = useCallback(
    (from: number, to: number) => {
      cancelAnimation();
      const start = performance.now();
      const duration = 400;

      const tick = (now: number) => {
        const t = Math.min((now - start) / duration, 1);
        const eased = 1 - (1 - t) ** 3;
        applyRotation(from + (to - from) * eased);

        if (t < 1) {
          snapFrameRef.current = requestAnimationFrame(tick);
        } else {
          snapFrameRef.current = null;
        }
      };

      snapFrameRef.current = requestAnimationFrame(tick);
    },
    [applyRotation, cancelAnimation],
  );

  const startInertia = useCallback(() => {
    cancelAnimation();

    const tick = () => {
      velocityRef.current *= INERTIA_FRICTION;
      const next = rotationRef.current + velocityRef.current * DRAG_SENSITIVITY;
      applyRotation(next);

      if (Math.abs(velocityRef.current) < INERTIA_MIN_VELOCITY) {
        inertiaFrameRef.current = null;
        const snapped = snapRotation(rotationRef.current, count);
        animateSnap(rotationRef.current, snapped);
        return;
      }

      inertiaFrameRef.current = requestAnimationFrame(tick);
    };

    inertiaFrameRef.current = requestAnimationFrame(tick);
  }, [animateSnap, applyRotation, cancelAnimation, count]);

  const handlePointerDown = useCallback(
    (e: React.PointerEvent<HTMLDivElement>) => {
      if (isLocked || count === 0) return;

      cancelAnimation();
      e.currentTarget.setPointerCapture(e.pointerId);
      isPointerDownRef.current = true;
      isDraggingRef.current = false;
      pointerStartX.current = e.clientX;
      lastPointerX.current = e.clientX;
      lastPointerTime.current = performance.now();
      velocityRef.current = 0;
    },
    [cancelAnimation, count, isLocked],
  );

  const handlePointerMove = useCallback(
    (e: React.PointerEvent<HTMLDivElement>) => {
      if (!isPointerDownRef.current || isLocked) return;

      const dx = e.clientX - pointerStartX.current;
      const now = performance.now();
      const frameDx = e.clientX - lastPointerX.current;
      const dt = now - lastPointerTime.current;

      if (!isDraggingRef.current && Math.abs(dx) > DRAG_THRESHOLD_PX) {
        isDraggingRef.current = true;
      }

      if (isDraggingRef.current) {
        if (dt > 0) {
          velocityRef.current = (frameDx / dt) * 16;
        }
        applyRotation(rotationRef.current + frameDx * DRAG_SENSITIVITY);
        lastPointerX.current = e.clientX;
        lastPointerTime.current = now;
      }
    },
    [applyRotation, isLocked],
  );

  const handlePointerUp = useCallback(() => {
    if (!isPointerDownRef.current) return;

    isPointerDownRef.current = false;

    if (!isDraggingRef.current && focusedCard) {
      onCardSelect(focusedCard);
    } else if (isDraggingRef.current) {
      isDraggingRef.current = false;
      startInertia();
    }
  }, [focusedCard, onCardSelect, startInertia]);

  if (count === 0) {
    return (
      <div className="flex flex-1 items-center justify-center text-sm text-[#6b4c9a]">
        所有卡牌已选完
      </div>
    );
  }

  return (
    <div
      className="relative flex flex-1 touch-none select-none items-center justify-center overflow-hidden"
      style={{ perspective: "1200px", perspectiveOrigin: "50% 42%", touchAction: "none" }}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerCancel={handlePointerUp}
      onLostPointerCapture={handlePointerUp}
    >
      <div
        className="ring-scene relative"
        style={{
          width: CARD_WIDTH,
          height: CARD_HEIGHT + 120,
          transformStyle: "preserve-3d",
        }}
      >
        <div
          className="absolute left-1/2 top-1/2"
          style={{
            width: 0,
            height: 0,
            transformStyle: "preserve-3d",
            transform: `rotateX(${RING_TILT_X}deg) rotateY(${rotation}deg)`,
          }}
        >
          {cards.map((card, index) => {
            const step = 360 / count;
            const { scale, opacity, zIndex, isFocused } = getCardVisuals(
              index,
              rotation,
              count,
              focusedIndex,
            );

            return (
              <div
                key={card.id}
                className="absolute"
                style={{
                  width: CARD_WIDTH,
                  height: CARD_HEIGHT,
                  left: -CARD_WIDTH / 2,
                  top: -CARD_HEIGHT / 2,
                  transformStyle: "preserve-3d",
                  transform: `rotateY(${index * step}deg) translateZ(${RING_RADIUS}px)`,
                  zIndex,
                  opacity,
                  pointerEvents: "none",
                }}
              >
                <div
                  className="relative"
                  style={{
                    width: CARD_WIDTH,
                    height: CARD_HEIGHT,
                    transform: `scale(${scale})`,
                    transformOrigin: "center center",
                    transformStyle: "preserve-3d",
                    overflow: "visible",
                  }}
                >
                  <div
                    className={`ring-card-face relative overflow-hidden rounded-lg ${
                      isFocused
                        ? "border-2 border-[#e8c547] shadow-lg"
                        : "border border-[#3d2a5c]/60"
                    }`}
                    style={{
                      width: CARD_WIDTH,
                      height: CARD_HEIGHT,
                      boxShadow: isFocused
                        ? "0 8px 32px rgba(232, 197, 71, 0.4)"
                        : "0 2px 8px rgba(0, 0, 0, 0.3)",
                    }}
                  >
                    <Image
                      src={CARD_BACK_IMAGE}
                      alt="tarot card back"
                      fill
                      sizes={`${CARD_WIDTH}px`}
                      className="object-cover"
                      draggable={false}
                      priority={isFocused}
                    />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}