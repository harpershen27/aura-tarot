"use client";

import { useCallback, useMemo, useRef, useState } from "react";
import CardFace from "@/components/CardFace";
import CardRingCarousel from "@/components/CardRingCarousel";
import type { Position, SelectedCard, TarotCard } from "@/lib/types";
import { POSITION_LABELS, POSITIONS } from "@/lib/types";
import { buildSelectedCard } from "@/lib/tarot";

interface SelectionScreenProps {
  deck: TarotCard[];
  onComplete: (cards: SelectedCard[]) => void;
}

function SlotCard({ selected }: { selected: SelectedCard }) {
  const { card, isReversed } = selected;

  return (
    <div className="relative w-full h-full rounded-xl overflow-hidden border border-[#c9a227]/50 shadow-lg">
      <CardFace card={card} />
      <span
        className={`absolute top-2 right-2 rounded-full px-2 py-0.5 text-[10px] ${
          isReversed
            ? "bg-[#3d2a5c]/80 text-[#a090b8]"
            : "bg-[#c9a227]/80 text-white"
        }`}
      >
        {isReversed ? "逆" : "正"}
      </span>
    </div>
  );
}

export default function SelectionScreen({
  deck,
  onComplete,
}: SelectionScreenProps) {
  const [selectedCards, setSelectedCards] = useState<SelectedCard[]>([]);
  const [isLocked, setIsLocked] = useState(false);

  const onCompleteRef = useRef(onComplete);

  const selectedIdSet = useMemo(
    () => new Set(selectedCards.map((c) => c.card.id)),
    [selectedCards],
  );

  const availableCards = useMemo(
    () => (deck ?? []).filter((card) => !selectedIdSet.has(card.id)),
    [deck, selectedIdSet],
  );

  const handleCardSelect = useCallback((card: TarotCard) => {
    if (isLocked || selectedIdSet.has(card.id)) return;

    const position = POSITIONS[selectedCards.length] as Position;
    const newCard = buildSelectedCard(card, position);

    setSelectedCards((prev) => {
      const updated = [...prev, newCard];

      if (updated.length === 3) {
        setIsLocked(true);
        setTimeout(() => {
          onCompleteRef.current(updated);
        }, 300);
      }
      return updated;
    });
  }, [isLocked, selectedCards.length, selectedIdSet]);

  return (
    <div className="flex min-h-screen flex-col">
      <header className="shrink-0 px-6 py-5 text-center">
        <h2 className="aura-title text-2xl font-semibold">选牌</h2>
        <p className="mt-2 text-sm text-[#a090b8]">
          点击卡牌选择 · 已选 {selectedCards.length}/3
        </p>
      </header>

      <div className="flex-1 flex items-center justify-center">
        <CardRingCarousel
          cards={availableCards}
          isLocked={isLocked}
          onCardSelect={handleCardSelect}
        />
      </div>

      <div className="shrink-0 border-t border-[#3d2a5c]/50 bg-[#0d0a14]/90 px-6 py-6 backdrop-blur-sm">
        <div className="mx-auto flex max-w-3xl items-end justify-center gap-12">
          {POSITIONS.map((position) => {
            const card = selectedCards.find((c) => c.position === position);
            return (
              <div key={position} className="flex flex-col items-center gap-3">
                <span className="text-xs tracking-widest text-[#6b4c9a]">
                  {POSITION_LABELS[position]}
                </span>
                {card ? (
                  <div className="h-[140px] w-[95px]">
                    <SlotCard selected={card} />
                  </div>
                ) : (
                  <div className="flex h-[140px] w-[95px] items-center justify-center rounded-xl border-2 border-dashed border-[#3d2a5c] bg-[#1a1028]/40">
                    <span className="text-3xl text-[#3d2a5c]">✦</span>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}