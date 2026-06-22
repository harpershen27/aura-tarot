import deckData from "@/data/tarot-deck.json";
import type { Position, SelectedCard, TarotCard } from "./types";

export const TAROT_DECK = deckData as TarotCard[];

export function shuffleDeck(cards: TarotCard[]): TarotCard[] {
  const shuffled = [...cards];
  for (let i = shuffled.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

export function randomReversed(): boolean {
  return Math.random() < 0.5;
}

export function getCardMeaning(card: TarotCard, isReversed: boolean): string {
  return isReversed ? card.reversed : card.upright;
}

export function buildSelectedCard(
  card: TarotCard,
  position: Position,
): SelectedCard {
  return {
    card,
    isReversed: randomReversed(),
    position,
  };
}

export function getCardById(id: string): TarotCard | undefined {
  return TAROT_DECK.find((card) => card.id === id);
}
