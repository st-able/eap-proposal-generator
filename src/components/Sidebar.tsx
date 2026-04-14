"use client";

import { cn } from "@/lib/cn";
import { getDomainFromUrl, formatDate } from "@/lib/utils";
import type { ProposalSummary } from "@/types";

interface SidebarProps {
  proposals: ProposalSummary[];
  selectedId: string | null;
  onSelect: (id: string) => void;
  onNew: () => void;
  loading: boolean;
}

export function Sidebar({
  proposals,
  selectedId,
  onSelect,
  onNew,
  loading,
}: SidebarProps) {
  return (
    <aside className="w-[240px] flex-shrink-0 flex flex-col h-screen bg-white border-r border-[#EDECE9]">
      {/* 브랜드 헤더 */}
      <div className="px-5 pt-6 pb-4 border-b border-[#F0EFEC]">
        <div className="flex items-center gap-2.5 mb-4">
          <div className="w-8 h-8 rounded-xl bg-[#E07B65] flex items-center justify-center shadow-sm">
            <BrainIcon />
          </div>
          <div>
            <p className="text-[13px] font-semibold text-[#1C1C1C] leading-tight">EAP 제안서</p>
            <p className="text-[10px] text-[#BCBAB6] leading-tight">AI Generator</p>
          </div>
        </div>

        <button
          onClick={onNew}
          className="w-full h-9 flex items-center justify-center gap-2 rounded-xl bg-[#F5F4F0] border border-[#EDECE9] text-[13px] font-medium text-[#5C5C5C] hover:bg-[#EDECE9] hover:text-[#1C1C1C] transition-colors"
        >
          <PlusIcon />
          새 제안서 생성
        </button>
      </div>

      {/* 히스토리 */}
      <div className="px-3 pt-3 pb-2">
        <p className="text-[10px] font-semibold text-[#BCBAB6] uppercase tracking-widest px-2 mb-2">
          최근 생성
        </p>
      </div>

      <div className="flex-1 overflow-y-auto px-3 pb-4 space-y-1">
        {loading && proposals.length === 0 && (
          <div className="space-y-1.5 px-1">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="rounded-xl p-3 animate-pulse bg-[#F5F4F0]">
                <div className="h-3 bg-[#EDECE9] rounded w-3/4 mb-2" />
                <div className="h-2.5 bg-[#F0EFEC] rounded w-1/2" />
              </div>
            ))}
          </div>
        )}

        {!loading && proposals.length === 0 && (
          <div className="text-center py-10 px-3">
            <div className="w-10 h-10 rounded-2xl bg-[#F5F4F0] flex items-center justify-center mx-auto mb-3">
              <EmptyIcon />
            </div>
            <p className="text-xs text-[#BCBAB6] font-medium">아직 생성된 제안서가 없어요</p>
          </div>
        )}

        {proposals.map((p) => (
          <button
            key={p.id}
            onClick={() => onSelect(p.id)}
            className={cn(
              "w-full text-left rounded-xl px-3 py-2.5 transition-all duration-150",
              selectedId === p.id
                ? "bg-[#FDF0ED] border border-[#F5C5BA]"
                : "hover:bg-[#F5F4F0] border border-transparent"
            )}
          >
            <p className={cn(
              "text-[13px] font-medium truncate leading-snug",
              selectedId === p.id ? "text-[#E07B65]" : "text-[#2C2C2C]"
            )}>
              {p.client_name || getDomainFromUrl(p.client_url)}
            </p>
            <p className="text-[11px] text-[#BCBAB6] mt-0.5 truncate">
              {formatDate(p.created_at)}
            </p>
          </button>
        ))}
      </div>
    </aside>
  );
}

function BrainIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M9.5 2A2.5 2.5 0 0 1 12 4.5v15a2.5 2.5 0 0 1-4.96-.46 2.5 2.5 0 0 1-2.96-3.08 3 3 0 0 1-.34-5.58 2.5 2.5 0 0 1 1.32-4.24 2.5 2.5 0 0 1 1.98-3A2.5 2.5 0 0 1 9.5 2Z" />
      <path d="M14.5 2A2.5 2.5 0 0 0 12 4.5v15a2.5 2.5 0 0 0 4.96-.46 2.5 2.5 0 0 0 2.96-3.08 3 3 0 0 0 .34-5.58 2.5 2.5 0 0 0-1.32-4.24 2.5 2.5 0 0 0-1.98-3A2.5 2.5 0 0 0 14.5 2Z" />
    </svg>
  );
}

function PlusIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
      <path d="M7 2v10M2 7h10" />
    </svg>
  );
}

function EmptyIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#BCBAB6" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
      <polyline points="14 2 14 8 20 8" />
    </svg>
  );
}
