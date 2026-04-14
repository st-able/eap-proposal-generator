const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY!;
const OPENROUTER_BASE_URL = "https://openrouter.ai/api/v1";
const MODEL = "anthropic/claude-sonnet-4-6"; // OpenRouter slug for Claude Sonnet

export interface OpenRouterMessage {
  role: "user" | "assistant" | "system";
  content: string;
}

export async function generateWithOpenRouter(
  messages: OpenRouterMessage[]
): Promise<string> {
  const response = await fetch(`${OPENROUTER_BASE_URL}/chat/completions`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${OPENROUTER_API_KEY}`,
      "Content-Type": "application/json",
      "HTTP-Referer": process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000",
      "X-Title": "AI Proposal Generator",
    },
    body: JSON.stringify({
      model: MODEL,
      messages,
      temperature: 0.7,
      max_tokens: 4096,
    }),
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`OpenRouter API 오류: ${response.status} - ${error}`);
  }

  const data = await response.json();
  const content = data.choices?.[0]?.message?.content;

  if (!content) {
    throw new Error("OpenRouter 응답에서 콘텐츠를 찾을 수 없습니다.");
  }

  return content;
}
