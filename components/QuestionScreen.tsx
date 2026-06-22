"use client";

import { useState } from "react";

interface QuestionScreenProps {
  onStart: (question: string) => void;
}

export default function QuestionScreen({ onStart }: QuestionScreenProps) {
  const [question, setQuestion] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = () => {
    const trimmed = question.trim();
    if (!trimmed) {
      setError("请先向牌灵提出你的问题");
      return;
    }
    setError("");
    onStart(trimmed);
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-6 py-12">
      <div className="animate-fade-in w-full max-w-xl text-center">
        <p className="mb-2 text-sm tracking-[0.3em] text-[#6b4c9a] uppercase">
          Aura Tarot
        </p>
        <h1 className="aura-title mb-3 text-4xl font-bold tracking-wide md:text-5xl">
          灵气塔罗
        </h1>
        <p className="mb-10 text-sm text-[#a090b8]">
          静心凝神，向牌灵倾诉你心中的疑惑
        </p>

        <div className="aura-card rounded-2xl p-6 text-left shadow-lg">
          <label
            htmlFor="question"
            className="mb-3 block text-sm text-[#c9a227]"
          >
            向牌灵提问
          </label>
          <textarea
            id="question"
            value={question}
            onChange={(e) => {
              setQuestion(e.target.value);
              if (error) setError("");
            }}
            onKeyDown={(e) => {
              if (e.key === "Enter" && (e.ctrlKey || e.metaKey)) {
                handleSubmit();
              }
            }}
            placeholder="例如：我近期的事业方向如何？"
            rows={5}
            className="w-full resize-none rounded-xl border border-[#3d2a5c] bg-[#0d0a14]/80 px-4 py-3 text-[#e8e0f0] placeholder-[#5a4a6a] outline-none transition focus:border-[#c9a227] focus:ring-1 focus:ring-[#c9a227]/40"
          />
          {error && (
            <p className="mt-2 text-sm text-red-400">{error}</p>
          )}
          <p className="mt-2 text-xs text-[#5a4a6a]">
            Ctrl + Enter 快捷提交
          </p>
        </div>

        <button
          type="button"
          onClick={handleSubmit}
          className="aura-btn mt-8 rounded-full px-10 py-3 text-base font-medium tracking-widest"
        >
          开始抽牌
        </button>
      </div>
    </div>
  );
}
