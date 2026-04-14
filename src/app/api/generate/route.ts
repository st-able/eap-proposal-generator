export const dynamic = "force-dynamic";
import { NextRequest, NextResponse } from "next/server";
import { scrapeWebsite } from "@/lib/scraper";
import { generateWithOpenRouter } from "@/lib/openrouter";
import { createServerClient } from "@/lib/supabase";
import { getDomainFromUrl } from "@/lib/utils";
import type { Proposal } from "@/types";

function buildPrompt(template: string, vars: Record<string, string>): string {
  return Object.entries(vars).reduce(
    (acc, [k, v]) => acc.replaceAll(`{{${k}}}`, v),
    template
  );
}

export async function POST(req: NextRequest) {
  let body: { url?: string; promptTemplate?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "잘못된 요청 형식입니다." }, { status: 400 });
  }

  const { url, promptTemplate } = body;

  if (!url) {
    return NextResponse.json({ error: "URL을 입력해주세요." }, { status: 400 });
  }

  // URL 유효성 검사
  let parsedUrl: URL;
  try {
    parsedUrl = new URL(url);
    if (!["http:", "https:"].includes(parsedUrl.protocol)) {
      throw new Error("http 또는 https URL만 지원합니다.");
    }
  } catch {
    return NextResponse.json(
      { error: "유효하지 않은 URL입니다. http:// 또는 https://로 시작하는 URL을 입력해주세요." },
      { status: 400 }
    );
  }

  // 1. 웹사이트 스크래핑
  let scraped: { content: string; title: string };
  try {
    scraped = await scrapeWebsite(url);
  } catch (err) {
    const message = err instanceof Error ? err.message : "웹사이트 스크래핑에 실패했습니다.";
    return NextResponse.json({ error: message }, { status: 503 });
  }

  const clientName = scraped.title || getDomainFromUrl(url);

  // 2. 기본 프롬프트 가져오기 (전달된 것 없으면 DB에서 조회)
  let template = promptTemplate;
  if (!template) {
    try {
      const supabase = createServerClient();
      const { data } = await supabase
        .from("prompt_templates")
        .select("template")
        .eq("name", "default")
        .single();
      template = data?.template ?? "";
    } catch {
      // 프롬프트 조회 실패 시 빈 문자열로 진행 (fallback)
      template = "";
    }
  }

  // 3. 프롬프트 변수 치환
  const finalPrompt = buildPrompt(template ?? "", {
    client_name: clientName,
    client_url: url,
    scraped_content: scraped.content,
  });

  // 4. AI 생성
  let proposalMarkdown: string;
  try {
    proposalMarkdown = await generateWithOpenRouter([
      { role: "user", content: finalPrompt },
    ]);
  } catch (err) {
    const message = err instanceof Error ? err.message : "AI 제안서 생성에 실패했습니다.";
    return NextResponse.json({ error: message }, { status: 502 });
  }

  // 5. DB 저장
  const proposal: Proposal = {
    id: "",
    client_url: url,
    client_name: clientName,
    scraped_content: scraped.content,
    prompt_used: finalPrompt,
    proposal_markdown: proposalMarkdown,
    created_at: new Date().toISOString(),
  };

  try {
    const supabase = createServerClient();
    const { data, error } = await supabase
      .from("proposals")
      .insert({
        client_url: url,
        client_name: clientName,
        scraped_content: scraped.content,
        prompt_used: finalPrompt,
        proposal_markdown: proposalMarkdown,
      })
      .select()
      .single();

    if (!error && data) {
      return NextResponse.json(data as Proposal);
    }
    // DB 저장 실패 시 로그만 남기고 proposal 반환
    console.error("DB 저장 실패:", error?.message);
  } catch (err) {
    console.error("DB 저장 예외:", err);
  }

  return NextResponse.json(proposal);
}
