"use client";

import { useState, useEffect, useCallback } from "react";
import { Sidebar } from "@/components/Sidebar";
import { GeneratorForm } from "@/components/GeneratorForm";
import { ProposalViewer } from "@/components/ProposalViewer";
import { PromptEditor } from "@/components/PromptEditor";
import { GlassButton } from "@/components/ui/GlassButton";
import type { Proposal, ProposalSummary, GenerateStatus } from "@/types";

export default function HomePage() {
  const [status, setStatus] = useState<GenerateStatus>("idle");
  const [proposals, setProposals] = useState<ProposalSummary[]>([]);
  const [selectedProposal, setSelectedProposal] = useState<Proposal | null>(null);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [showPromptEditor, setShowPromptEditor] = useState(false);
  const [error, setError] = useState<string>("");
  const [historyLoading, setHistoryLoading] = useState(true);

  const fetchProposals = useCallback(async () => {
    try {
      const res = await fetch("/api/proposals");
      if (!res.ok) return;
      const data = await res.json();
      setProposals(Array.isArray(data) ? data : []);
    } catch {
      // 히스토리 로딩 실패 무시
    } finally {
      setHistoryLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProposals();
  }, [fetchProposals]);

  async function handleGenerate(url: string) {
    setStatus("scraping");
    setError("");
    setSelectedId(null);
    setSelectedProposal(null);
    setShowPromptEditor(false);

    const stageTimer = setTimeout(() => {
      setStatus((prev) => (prev === "scraping" ? "generating" : prev));
    }, 2000);

    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url }),
      });

      clearTimeout(stageTimer);
      const data = await res.json();

      if (!res.ok) {
        setStatus("error");
        setError(data.error || "제안서 생성에 실패했습니다.");
        return;
      }

      setSelectedProposal(data as Proposal);
      setSelectedId(data.id || null);
      setStatus("done");
      fetchProposals();
    } catch {
      clearTimeout(stageTimer);
      setStatus("error");
      setError("네트워크 오류가 발생했습니다. 다시 시도해주세요.");
    }
  }

  async function handleSelectHistory(id: string) {
    if (selectedId === id) return;
    setSelectedId(id);
    setStatus("idle");
    setError("");
    setShowPromptEditor(false);

    try {
      const res = await fetch(`/api/proposals?id=${id}`);
      if (!res.ok) return;
      const data = await res.json();
      setSelectedProposal(data as Proposal);
      setStatus("done");
    } catch {
      // 무시
    }
  }

  function handleNew() {
    setStatus("idle");
    setSelectedProposal(null);
    setSelectedId(null);
    setError("");
    setShowPromptEditor(false);
  }

  return (
    <div className="flex h-screen bg-[#F5F4F0] overflow-hidden">
      {/* 사이드바 */}
      <Sidebar
        proposals={proposals}
        selectedId={selectedId}
        onSelect={handleSelectHistory}
        onNew={handleNew}
        loading={historyLoading}
      />

      {/* 메인 영역 */}
      <main className="flex-1 flex flex-col overflow-hidden">
        {/* 상단 헤더 */}
        <header className="flex-shrink-0 flex items-center justify-between px-6 py-4 bg-white border-b border-[#EDECE9] shadow-[0_1px_3px_rgba(0,0,0,0.04)]">
          <div>
            <h1 className="text-[15px] font-semibold text-[#1C1C1C]">
              EAP 제안서 생성기
            </h1>
            <p className="text-[12px] text-[#9CA3AF] mt-0.5">
              고객사 웹사이트를 분석하여 맞춤형 EAP 제안서를 생성합니다
            </p>
          </div>

          <div className="flex items-center gap-2">
            {/* 상태 배지 */}
            {(status === "scraping" || status === "generating") && (
              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#FDF0ED] border border-[#F5C5BA] text-[12px] font-medium text-[#E07B65]">
                <span className="relative flex h-1.5 w-1.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#E07B65] opacity-60" />
                  <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-[#E07B65]" />
                </span>
                {status === "scraping" ? "분석 중" : "생성 중"}
              </div>
            )}

            <GlassButton
              variant="ghost"
              size="sm"
              onClick={() => setShowPromptEditor((v) => !v)}
              className={showPromptEditor ? "border-[#E07B65] text-[#E07B65] bg-[#FDF0ED]" : ""}
            >
              <SettingsIcon active={showPromptEditor} />
              프롬프트 수정
            </GlassButton>
          </div>
        </header>

        {/* 스크롤 콘텐츠 */}
        <div className="flex-1 overflow-y-auto p-6">
          <div className="max-w-3xl space-y-4">
            <GeneratorForm onGenerate={handleGenerate} status={status} />

            {showPromptEditor && (
              <PromptEditor onClose={() => setShowPromptEditor(false)} />
            )}

            <ProposalViewer
              proposal={selectedProposal}
              status={status}
              error={error}
            />
          </div>
        </div>
      </main>
    </div>
  );
}

function SettingsIcon({ active }: { active: boolean }) {
  return (
    <svg
      width="13"
      height="13"
      viewBox="0 0 24 24"
      fill="none"
      stroke={active ? "#E07B65" : "currentColor"}
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="12" cy="12" r="3" />
      <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
    </svg>
  );
}
