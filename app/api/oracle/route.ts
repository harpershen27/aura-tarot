import { NextRequest, NextResponse } from "next/server";
import { getCardMeaning } from "@/lib/tarot";
import type { SelectedCard } from "@/lib/types";
import { POSITION_LABELS } from "@/lib/types";

interface OracleRequestBody {
  question: string;
  cards: SelectedCard[];
}

function buildPrompt(question: string, cards: SelectedCard[]): string {
  const cardDescriptions = cards
    .map((selected) => {
      const position = POSITION_LABELS[selected.position];
      const orientation = selected.isReversed ? "逆位" : "正位";
      const meaning = getCardMeaning(selected.card, selected.isReversed);
      return `【${position}】${selected.card.name}（${orientation}）：${meaning}`;
    })
    .join("\n");

  return `你是一位神秘而温柔的塔罗牌灵，名为「灵气塔罗之牌灵」。请根据以下信息，为求问者撰写一段综合灵谕解读。

求问者的问题：
${question}

三张牌（过去·现在·未来牌阵）：
${cardDescriptions}

要求：
1. 以牌灵的口吻书写，语气神秘但不晦涩，温柔而有力量
2. 综合三张牌的位置含义，针对求问者的问题给出连贯解读
3. 给出实用的指引或启示，篇幅 200-400 字
4. 不要使用 markdown 格式，直接输出纯文本
5. 用中文回答`;
}

export async function POST(request: NextRequest) {
  const apiKey = process.env.DEEPSEEK_API_KEY;

  if (!apiKey) {
    return NextResponse.json(
      { error: "未配置 DeepSeek API Key，请在 .env.local 中设置 DEEPSEEK_API_KEY" },
      { status: 500 },
    );
  }

  let body: OracleRequestBody;
  try {
    body = (await request.json()) as OracleRequestBody;
  } catch {
    return NextResponse.json({ error: "请求格式无效" }, { status: 400 });
  }

  const { question, cards } = body;

  if (!question?.trim() || !cards?.length) {
    return NextResponse.json({ error: "缺少问题或牌面信息" }, { status: 400 });
  }

  try {
    const response = await fetch("https://api.deepseek.com/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: "deepseek-chat",
        messages: [
          {
            role: "user",
            content: buildPrompt(question, cards),
          },
        ],
        temperature: 0.85,
        max_tokens: 800,
      }),
    });

    if (!response.ok) {
      const errText = await response.text();
      console.error("DeepSeek API error:", errText);
      return NextResponse.json(
        { error: "牌灵感应受阻，请检查 API Key 或账户余额" },
        { status: 502 },
      );
    }

    const data = (await response.json()) as {
      choices?: Array<{ message?: { content?: string } }>;
    };

    const oracle = data.choices?.[0]?.message?.content?.trim();

    if (!oracle) {
      return NextResponse.json(
        { error: "牌灵未回应，请稍后重试" },
        { status: 502 },
      );
    }

    return NextResponse.json({ oracle });
  } catch (error) {
    console.error("Oracle fetch error:", error);
    return NextResponse.json(
      { error: "连接牌灵时发生错误，请稍后重试" },
      { status: 500 },
    );
  }
}
