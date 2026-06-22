"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import type { SelectedCard } from "@/lib/types";
import { POSITION_LABELS } from "@/lib/types";
import { getCardMeaning } from "@/lib/tarot";
import CardFace from "@/components/CardFace";

interface ReadingScreenProps {
  question: string;
  selectedCards: SelectedCard[];
  onReset: () => void;
}

export default function ReadingScreen({
  question,
  selectedCards,
  onReset,
}: ReadingScreenProps) {
  const [oracle, setOracle] = useState("");
  const [oracleStatus, setOracleStatus] = useState<
    "loading" | "success" | "error"
  >("loading");
  const [oracleError, setOracleError] = useState("");

  useEffect(() => {
    let cancelled = false;

    async function fetchOracle() {
      setOracleStatus("loading");
      setOracle("");
      setOracleError("");

      try {
        const response = await fetch("/api/oracle", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ question, cards: selectedCards }),
        });

        const data = (await response.json()) as {
          oracle?: string;
          error?: string;
        };

        if (cancelled) return;

        if (!response.ok) {
          setOracleStatus("error");
          setOracleError(data.error ?? "灵谕感应失败，请稍后重试");
          return;
        }

        setOracle(data.oracle ?? "");
        setOracleStatus("success");
      } catch {
        if (!cancelled) {
          setOracleStatus("error");
          setOracleError("网络连接失败，请检查网络后重试");
        }
      }
    }

    fetchOracle();

    return () => {
      cancelled = true;
    };
  }, [question, selectedCards]);

  return (
    <div className="min-h-screen px-6 py-10">
      <div className="mx-auto max-w-3xl">
        <header className="mb-10 text-center">
          <h2 className="aura-title text-3xl font-semibold">解读</h2>
          <p className="mt-3 text-sm text-[#a090b8]">
            你的问题：「{question}」
          </p>
        </header>

        <div className="mb-10 grid gap-6 md:grid-cols-3">
          {selectedCards.map((selected, index) => (
            <motion.div
              key={selected.card.id}
              className="aura-card rounded-2xl p-5"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.15, duration: 0.5 }}
            >
              <div className="flex gap-4 items-start">
                <div className="shrink-0 w-[72px] h-[108px] rounded-lg overflow-hidden border border-[#c9a227]/40 shadow-md">
                  <CardFace card={selected.card} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="mb-2 flex items-center justify-between">
                    <span className="text-xs tracking-widest text-[#6b4c9a]">
                      {POSITION_LABELS[selected.position]}
                    </span>
                    <span
                      className={`rounded-full px-2.5 py-0.5 text-xs ${
                        selected.isReversed
                          ? "bg-[#3d2a5c] text-[#a090b8]"
                          : "bg-[#c9a227]/20 text-[#e8c547]"
                      }`}
                    >
                      {selected.isReversed ? "逆位" : "正位"}
                    </span>
                  </div>
                  <h3 className="mb-1 text-lg font-medium text-[#e8c547]">
                    {selected.card.name}
                  </h3>
                  <p className="mb-2 text-xs text-[#5a4a6a]">
                    {selected.card.nameEn}
                  </p>
                  <p className="text-sm leading-relaxed text-[#c8b8d8]">
                    {getCardMeaning(selected.card, selected.isReversed)}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        <motion.div
          className="aura-card mb-10 rounded-2xl p-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6, duration: 0.6 }}
        >
          <div className="mb-4 flex items-center gap-2">
            <span className="text-[#c9a227]">✦</span>
            <h3 className="text-lg font-medium tracking-widest text-[#e8c547]">
              灵谕
            </h3>
            <span className="text-[#c9a227]">✦</span>
          </div>

          {oracleStatus === "loading" && (
            <div className="flex items-center gap-3 py-4">
              <motion.span
                className="inline-block h-2 w-2 rounded-full bg-[#c9a227]"
                animate={{ opacity: [0.3, 1, 0.3] }}
                transition={{ repeat: Infinity, duration: 1.2 }}
              />
              <p className="text-sm text-[#a090b8]">牌灵正在感应…</p>
            </div>
          )}

          {oracleStatus === "success" && (
            <motion.p
              className="text-sm leading-8 text-[#d8cce8] whitespace-pre-wrap"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8 }}
            >
              {oracle}
            </motion.p>
          )}

          {oracleStatus === "error" && (
            <div className="py-2">
              <p className="text-sm text-red-400">{oracleError}</p>
              <p className="mt-2 text-xs text-[#5a4a6a]">
                单牌解读仍可参考上方内容。若需灵谕解读，请在项目根目录配置
                DEEPSEEK_API_KEY。
              </p>
            </div>
          )}
        </motion.div>

        <div className="text-center">
          <button
            type="button"
            onClick={onReset}
            className="aura-btn rounded-full px-10 py-3 text-base font-medium tracking-widest"
          >
            重新占卜
          </button>
        </div>
      </div>
    </div>
  );
}
