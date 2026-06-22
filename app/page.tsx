"use client";

import { useCallback, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import QuestionScreen from "@/components/QuestionScreen";
import SelectionScreen from "@/components/SelectionScreen";
import ReadingScreen from "@/components/ReadingScreen";
import { shuffleDeck, TAROT_DECK } from "@/lib/tarot";
import type { AppStep, SelectedCard } from "@/lib/types";

export default function Home() {
  const [step, setStep] = useState<AppStep>("question");
  const [question, setQuestion] = useState("");
  const [deck, setDeck] = useState(() => shuffleDeck(TAROT_DECK));
  const [selectedCards, setSelectedCards] = useState<SelectedCard[]>([]);

  const handleStart = useCallback((q: string) => {
    setQuestion(q);
    setDeck(shuffleDeck(TAROT_DECK));
    setSelectedCards([]);
    setStep("selection");
  }, []);

  const handleSelectionComplete = useCallback((cards: SelectedCard[]) => {
    setSelectedCards(cards);
    setStep("reading");
  }, []);

  const handleReset = useCallback(() => {
    setQuestion("");
    setDeck(shuffleDeck(TAROT_DECK));
    setSelectedCards([]);
    setStep("question");
  }, []);

  return (
    <main className="relative z-10 min-h-screen">
      <AnimatePresence mode="wait">
        {step === "question" && (
          <motion.div
            key="question"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
          >
            <QuestionScreen onStart={handleStart} />
          </motion.div>
        )}

        {step === "selection" && (
          <motion.div
            key="selection"
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -30 }}
            transition={{ duration: 0.4 }}
          >
            <SelectionScreen deck={deck} onComplete={handleSelectionComplete} />
          </motion.div>
        )}

        {step === "reading" && (
          <motion.div
            key="reading"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
          >
            <ReadingScreen
              question={question}
              selectedCards={selectedCards}
              onReset={handleReset}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}
