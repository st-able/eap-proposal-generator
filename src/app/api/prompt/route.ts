export const dynamic = "force-dynamic";
import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@/lib/supabase";

export async function GET() {
  const supabase = createServerClient();
  const { data, error } = await supabase
    .from("prompt_templates")
    .select("*")
    .eq("name", "default")
    .single();

  if (error || !data) {
    return NextResponse.json({ error: "프롬프트 템플릿을 찾을 수 없습니다." }, { status: 404 });
  }

  return NextResponse.json(data);
}

export async function PUT(req: NextRequest) {
  let body: { template?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "잘못된 요청 형식입니다." }, { status: 400 });
  }

  const { template } = body;
  if (!template || typeof template !== "string") {
    return NextResponse.json({ error: "template 값이 필요합니다." }, { status: 400 });
  }

  const supabase = createServerClient();
  const { data, error } = await supabase
    .from("prompt_templates")
    .upsert({ name: "default", template, updated_at: new Date().toISOString() }, { onConflict: "name" })
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: "프롬프트 저장에 실패했습니다." }, { status: 500 });
  }

  return NextResponse.json(data);
}
