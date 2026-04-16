export const dynamic = "force-dynamic";
import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@/lib/supabase";
import { generateWithOpenRouter } from "@/lib/openrouter";
import { MAJU_INFO } from "@/lib/data/maju-info";
import type { SlideClientData } from "@/types";

function buildSlidePrompt(
  clientName: string,
  clientUrl: string,
  scrapedContent: string
): string {
  return `당신은 기업 심리상담 및 EAP(근로자 지원 프로그램) 전문 컨설턴트입니다.

아래 기업의 웹사이트 분석 내용을 바탕으로, EAP 도입 제안서 슬라이드에 들어갈 고객사 맞춤 내용을 JSON 형식으로 작성해주세요.

[고객사 정보]
- 기업명: ${clientName}
- 웹사이트: ${clientUrl}

[웹사이트 분석 내용]
${scrapedContent}

[마주심리상담소 제안 기관 정보]
- 상담사: ${MAJU_INFO.counselors.count}인, ${MAJU_INFO.counselors.qualification}
- 위치: ${MAJU_INFO.address}
- 운영시간: ${MAJU_INFO.hours.weekday}, ${MAJU_INFO.hours.saturday}

다음 JSON 구조에 맞게 작성해주세요. JSON만 응답하고 다른 텍스트는 포함하지 마세요.

{
  "client_analysis": {
    "bullets": [
      "업종과 사업 특성에 대한 분석 (1~2문장)",
      "임직원 규모 및 업무 환경 특성 분석",
      "조직 문화 및 근무 특성 분석"
    ],
    "risk_factors": [
      "해당 업종에서 예상되는 심리적 리스크 요인 1",
      "해당 업종에서 예상되는 심리적 리스크 요인 2",
      "해당 업종에서 예상되는 심리적 리스크 요인 3"
    ]
  },
  "eap_need": {
    "bullets": [
      "해당 기업 특성상 EAP가 필요한 이유 1 (구체적 수치나 사례 포함)",
      "해당 기업 특성상 EAP가 필요한 이유 2",
      "해당 기업 특성상 EAP가 필요한 이유 3",
      "EAP 도입 시 해결 가능한 문제"
    ]
  },
  "proposed_program": {
    "items": [
      {
        "name": "프로그램명 (예: 개인 심리상담)",
        "desc": "해당 기업에 맞춘 프로그램 설명 (1~2문장)"
      },
      {
        "name": "프로그램명 2",
        "desc": "설명"
      },
      {
        "name": "프로그램명 3",
        "desc": "설명"
      },
      {
        "name": "프로그램명 4",
        "desc": "설명"
      }
    ]
  },
  "expected_effects": {
    "stats": [
      { "label": "직원 심리 건강 만족도 향상", "value": "최대 40%" },
      { "label": "업무 생산성 향상", "value": "평균 25%" },
      { "label": "이직률 감소", "value": "약 30%" },
      { "label": "결근율 감소", "value": "약 20%" }
    ],
    "bullets": [
      "해당 기업에 특화된 기대 효과 1",
      "해당 기업에 특화된 기대 효과 2",
      "해당 기업에 특화된 기대 효과 3"
    ]
  }
}

반드시 순수 JSON만 응답하세요. 마크다운 코드블록(\`\`\`)을 사용하지 마세요.`;
}

export async function POST(req: NextRequest) {
  let body: { proposal_id?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "잘못된 요청 형식입니다." }, { status: 400 });
  }

  const { proposal_id } = body;
  if (!proposal_id) {
    return NextResponse.json({ error: "proposal_id가 필요합니다." }, { status: 400 });
  }

  const supabase = createServerClient();

  // 1. 제안서 조회
  const { data: proposal, error: proposalError } = await supabase
    .from("proposals")
    .select("id, client_name, client_url, scraped_content")
    .eq("id", proposal_id)
    .single();

  if (proposalError || !proposal) {
    return NextResponse.json({ error: "제안서를 찾을 수 없습니다." }, { status: 404 });
  }

  // 2. AI로 슬라이드 JSON 생성
  let slidesJson: SlideClientData;
  try {
    const prompt = buildSlidePrompt(
      proposal.client_name ?? "고객사",
      proposal.client_url,
      proposal.scraped_content ?? ""
    );
    const raw = await generateWithOpenRouter([{ role: "user", content: prompt }]);

    // JSON 파싱 (코드블록 있을 경우 제거)
    const cleaned = raw.replace(/^```json?\s*/i, "").replace(/\s*```$/i, "").trim();
    slidesJson = JSON.parse(cleaned);
  } catch (err) {
    const message = err instanceof Error ? err.message : "슬라이드 생성에 실패했습니다.";
    return NextResponse.json({ error: message }, { status: 502 });
  }

  // 3. DB 저장
  const { data, error } = await supabase
    .from("slide_presentations")
    .insert({ proposal_id, slides_json: slidesJson })
    .select()
    .single();

  if (error || !data) {
    console.error("슬라이드 DB 저장 실패:", error?.message);
    // 저장 실패 시에도 생성된 데이터 반환
    return NextResponse.json({
      id: "",
      proposal_id,
      slides_json: slidesJson,
      created_at: new Date().toISOString(),
    });
  }

  return NextResponse.json(data);
}

// 기존 슬라이드 조회
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const proposal_id = searchParams.get("proposal_id");

  if (!proposal_id) {
    return NextResponse.json({ error: "proposal_id가 필요합니다." }, { status: 400 });
  }

  const supabase = createServerClient();
  const { data, error } = await supabase
    .from("slide_presentations")
    .select("*")
    .eq("proposal_id", proposal_id)
    .order("created_at", { ascending: false, nullsFirst: false })
    .limit(1)
    .single();

  if (error || !data) {
    return NextResponse.json(null);
  }

  return NextResponse.json(data);
}
