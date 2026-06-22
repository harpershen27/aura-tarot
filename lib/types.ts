export type Arcana = "major" | "minor";
export type Suit = "wands" | "cups" | "swords" | "pentacles" | null;
export type Position = "past" | "present" | "future";
export type AppStep = "question" | "selection" | "reading";

export interface TarotCard {
  id: string;
  number: number;
  name: string;
  nameEn: string;
  arcana: Arcana;
  suit: Suit;
  upright: string;
  reversed: string;
}

export interface SelectedCard {
  card: TarotCard;
  isReversed: boolean;
  position: Position;
}

export const POSITION_LABELS: Record<Position, string> = {
  past: "过去",
  present: "现在",
  future: "未来",
};

export const POSITIONS: Position[] = ["past", "present", "future"];
