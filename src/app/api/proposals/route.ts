export const dynamic = "force-dynamic";
import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@/lib/supabase";
import type { Proposal, ProposalSummary } from "@/types";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");
  const supabase = createServerClient();

  // 특정 제안서 전체 내용 조회
  if (id) {
    const { data, error } = await supabase
      .from("proposals")
      .select("*")
      .eq("id", id)
      .single();

    if (error || !data) {
      return NextResponse.json({ error: "제안서를 찾을 수 없습니다." }, { status: 404 });
    }

    return NextResponse.json(data as Proposal);
  }

  // 목록 조회 (최신 20개)
  const { data, error } = await supabase
    .from("proposals")
    .select("id, client_url, client_name, created_at")
    .order("created_at", { ascending: false, nullsFirst: false })
    .limit(20);

  if (error) {
    return NextResponse.json({ error: "제안서 목록 조회에 실패했습니다." }, { status: 500 });
  }

  return NextResponse.json((data ?? []) as ProposalSummary[]);
}
