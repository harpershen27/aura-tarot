"use client";

import Image from "next/image";
import type { TarotCard } from "@/lib/types";

function getCardImagePath(card: TarotCard): string {
  if (card.arcana === "major") {
    const names: Record<number, string> = {
      0: "愚人", 1: "魔术师", 2: "女祭司", 3: "皇后", 4: "皇帝",
      5: "教皇", 6: "恋人", 7: "战车", 8: "力量", 9: "隐士",
      10: "命运之轮", 11: "正义", 12: "倒吊人", 13: "死神", 14: "节制",
      15: "恶魔", 16: "塔", 17: "星星", 18: "月亮", 19: "太阳",
      20: "审判", 21: "世界",
    };
    return `/images/cards/${card.number}${names[card.number] || card.name}.png`;
  }

  const suitMap: Record<string, string> = {
    wands: "权杖",
    cups: "圣杯",
    swords: "宝剑",
    pentacles: "星币",
  };

  const suitName = suitMap[card.suit || ""] || card.suit || "";

  let numberOrRank: string;
  if (card.nameEn.startsWith("Ace")) numberOrRank = "1";
  else if (card.nameEn.startsWith("Page")) numberOrRank = "侍从";
  else if (card.nameEn.startsWith("Knight")) numberOrRank = "骑士";
  else if (card.nameEn.startsWith("Queen")) numberOrRank = "王后";
  else if (card.nameEn.startsWith("King")) numberOrRank = "国王";
  else numberOrRank = String(card.number);

  return `/images/cards/${suitName}${numberOrRank}.png`;
}

export default function CardFace({ card }: { card: TarotCard }) {
  const imagePath = getCardImagePath(card);

  return (
    <div className="relative w-full h-full">
      <Image
        src={imagePath}
        alt={card.name}
        fill
        className="object-cover"
        sizes="100%"
      />
    </div>
  );
}