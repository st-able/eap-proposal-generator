"use client";

import { useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { GlassButton } from "@/components/ui/GlassButton";
import { LoadingPulse } from "@/components/ui/LoadingPulse";
import { getDomainFromUrl, copyToClipboard, downloadAsFile, formatDate } from "@/lib/utils";
import type { Proposal, GenerateStatus } from "@/types";

interface ProposalViewerProps {
  proposal: Proposal | null;
  status: GenerateStatus;
  error?: string;
}

export function ProposalViewer({ proposal, status, error }: ProposalViewerProps) {
  const [copied, setCopied] = useState(false);

  async function handleCopy() {
    if (!proposal) return;
    await copyToClipboard(proposal.proposal_markdown);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  function handleDownload() {
    if (!proposal) return;
    const filename = `EAP_제안서_${proposal.client_name || getDomainFromUrl(proposal.client_url)}_${new Date().toISOString().slice(0, 10)}.md`;
    downloadAsFile(proposal.proposal_markdown, filename, "text/markdown");
  }

  /* 초기 상태 */
  if (status === "idle" && !proposal) {
    return (
      <div className="bg-white border border-[#EDECE9] rounded-2xl shadow-[0_1px_3px_rgba(0,0,0,0.05)] flex flex-col items-center justify-center py-20 text-center">
        <div className="w-14 h-14 rounded-2xl bg-[#F5F4F0] border border-[#EDECE9] flex items-center justify-center mb-4">
          <DocumentIcon />
        </div>
        <p className="text-sm font-semibold text-[#5C5C5C]">고객사 URL을 입력하고 제안서를 생성해보세요</p>
        <p className="text-[13px] text-[#BCBAB6] mt-1.5 max-w-xs leading-relaxed">
          웹사이트를 분석하여 맞춤형 EAP 제안서를 자동으로 작성합니다
        </p>
      </div>
    );
  }

  /* 로딩 상태 */
  if (status === "scraping" || status === "generating") {
    return (
      <div className="bg-white border border-[#EDECE9] rounded-2xl shadow-[0_1px_3px_rgba(0,0,0,0.05)] p-6 animate-fade-in">
        <div className="flex items-start gap-3.5 mb-5">
          <div className="w-10 h-10 rounded-xl bg-[#FDF0ED] border border-[#F5C5BA] flex items-center justify-center shrink-0">
            <SpinnerIcon />
          </div>
          <div>
            <p className="text-sm font-semibold text-[#1C1C1C]">
              {status === "scraping" ? "웹사이트 분석 중" : "EAP 제안서 작성 중"}
            </p>
            <p className="text-[13px] text-[#9CA3AF] mt-0.5">
              {status === "scraping"
                ? "고객사 웹사이트 내용을 수집하고 있습니다..."
                : "AI가 맞춤형 EAP 제안서를 작성하고 있습니다..."}
            </p>
          </div>
        </div>
        <LoadingPulse lines={status === "generating" ? 10 : 5} />
      </div>
    );
  }

  /* 에러 상태 */
  if (status === "error" || error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-2xl p-5 animate-fade-in">
        <div className="flex gap-3">
          <div className="w-9 h-9 rounded-xl bg-red-100 border border-red-200 flex items-center justify-center shrink-0">
            <ErrorIcon />
          </div>
          <div>
            <p className="text-sm font-semibold text-red-700 mb-1">생성 실패</p>
            <p className="text-[13px] text-red-500">{error || "알 수 없는 오류가 발생했습니다."}</p>
            <p className="text-xs text-red-400 mt-1.5">URL을 확인하고 다시 시도해주세요.</p>
          </div>
        </div>
      </div>
    );
  }

  if (!proposal) return null;

  /* 완성된 제안서 */
  return (
    <div className="bg-white border border-[#EDECE9] rounded-2xl shadow-[0_2px_8px_rgba(0,0,0,0.07)] overflow-hidden animate-fade-in">
      {/* 헤더 바 */}
      <div className="flex items-center justify-between px-5 py-3.5 border-b border-[#F0EFEC] bg-[#FAFAF8]">
        <div className="flex items-center gap-3 min-w-0">
          <div className="w-8 h-8 rounded-lg bg-[#FDF0ED] border border-[#F5C5BA] flex items-center justify-center shrink-0">
            <AccentDocIcon />
          </div>
          <div className="min-w-0">
            <p className="text-[13px] font-semibold text-[#1C1C1C] truncate">
              {proposal.client_name || getDomainFromUrl(proposal.client_url)}
            </p>
            <p className="text-[11px] text-[#BCBAB6] truncate">{formatDate(proposal.created_at)}</p>
          </div>
        </div>

        <div className="flex items-center gap-2 ml-4 shrink-0">
          <GlassButton variant="ghost" size="sm" onClick={handleCopy} className="gap-1.5 text-[12px]">
            {copied ? <CheckIcon /> : <CopyIcon />}
            {copied ? "복사됨" : "복사"}
          </GlassButton>
          <GlassButton variant="ghost" size="sm" onClick={handleDownload} className="gap-1.5 text-[12px]">
            <DownloadIcon />
            다운로드
          </GlassButton>
        </div>
      </div>

      {/* 본문 */}
      <div className="p-6 overflow-auto">
        <ReactMarkdown className="proposal-prose" remarkPlugins={[remarkGfm]}>
          {proposal.proposal_markdown}
        </ReactMarkdown>
      </div>
    </div>
  );
}

function DocumentIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#BCBAB6" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
      <polyline points="14 2 14 8 20 8" />
      <line x1="16" y1="13" x2="8" y2="13" />
      <line x1="16" y1="17" x2="8" y2="17" />
    </svg>
  );
}

function AccentDocIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#E07B65" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
      <polyline points="14 2 14 8 20 8" />
    </svg>
  );
}

function SpinnerIcon() {
  return (
    <svg className="animate-spin" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#E07B65" strokeWidth="2.5" strokeLinecap="round">
      <path d="M21 12a9 9 0 1 1-6.219-8.56" />
    </svg>
  );
}

function ErrorIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#ef4444" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" />
      <line x1="12" y1="8" x2="12" y2="12" />
      <line x1="12" y1="16" x2="12.01" y2="16" />
    </svg>
  );
}

function CopyIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="9" y="9" width="13" height="13" rx="2" />
      <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
    </svg>
  );
}

function CheckIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#22c55e" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="20 6 9 17 4 12" />
    </svg>
  );
}

function DownloadIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
      <polyline points="7 10 12 15 17 10" />
      <line x1="12" y1="15" x2="12" y2="3" />
    </svg>
  );
}
