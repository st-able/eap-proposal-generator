"use client";

import { useState, useEffect } from "react";
import { GlassTextarea } from "@/components/ui/GlassInput";
import { GlassButton } from "@/components/ui/GlassButton";
import { formatDate } from "@/lib/utils";

interface PromptEditorProps {
  onClose: () => void;
}

export function PromptEditor({ onClose }: PromptEditorProps) {
  const [template, setTemplate] = useState("");
  const [updatedAt, setUpdatedAt] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchPrompt() {
      try {
        const res = await fetch("/api/prompt");
        if (!res.ok) throw new Error();
        const data = await res.json();
        setTemplate(data.template ?? "");
        setUpdatedAt(data.updated_at ?? null);
      } catch {
        setError("프롬프트 템플릿을 불러올 수 없습니다.");
      } finally {
        setLoading(false);
      }
    }
    fetchPrompt();
  }, []);

  async function handleSave() {
    setSaving(true);
    setError("");
    try {
      const res = await fetch("/api/prompt", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ template }),
      });
      if (!res.ok) throw new Error();
      const data = await res.json();
      setUpdatedAt(data.updated_at ?? null);
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    } catch {
      setError("저장에 실패했습니다. 다시 시도해주세요.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="bg-white border border-[#EDECE9] rounded-2xl shadow-[0_2px_8px_rgba(0,0,0,0.07)] overflow-hidden animate-slide-down">
      {/* 헤더 */}
      <div className="flex items-center justify-between px-5 py-3.5 border-b border-[#F0EFEC] bg-[#FAFAF8]">
        <div className="flex items-center gap-3">
          <div className="w-7 h-7 rounded-lg bg-[#F5F4F0] border border-[#EDECE9] flex items-center justify-center">
            <EditIcon />
          </div>
          <div>
            <p className="text-[13px] font-semibold text-[#1C1C1C]">프롬프트 편집</p>
            {updatedAt && (
              <p className="text-[11px] text-[#BCBAB6]">
                마지막 수정: {formatDate(updatedAt)}
              </p>
            )}
          </div>
        </div>
        <button
          onClick={onClose}
          className="w-7 h-7 rounded-lg flex items-center justify-center text-[#BCBAB6] hover:text-[#5C5C5C] hover:bg-[#F5F4F0] transition-colors"
        >
          <CloseIcon />
        </button>
      </div>

      {/* 편집 영역 */}
      <div className="p-5 space-y-3">
        {/* 변수 안내 */}
        <div className="flex flex-wrap items-center gap-2 p-3 bg-[#F5F4F0] rounded-xl border border-[#EDECE9]">
          <span className="text-[11px] text-[#9CA3AF] font-medium">사용 가능한 변수:</span>
          {["{{client_name}}", "{{client_url}}", "{{scraped_content}}"].map((v) => (
            <code
              key={v}
              className="bg-white border border-[#EDECE9] text-[#E07B65] px-2 py-0.5 rounded-lg text-[11px] font-mono shadow-sm"
            >
              {v}
            </code>
          ))}
        </div>

        {loading ? (
          <div className="h-72 rounded-xl bg-[#F5F4F0] animate-pulse border border-[#EDECE9]" />
        ) : (
          <GlassTextarea
            rows={14}
            value={template}
            onChange={(e) => setTemplate(e.target.value)}
            disabled={saving}
            className="text-xs leading-relaxed"
            placeholder="프롬프트를 입력하세요..."
          />
        )}

        {error && (
          <p className="text-xs text-red-500 flex items-center gap-1.5">
            <span>⚠</span> {error}
          </p>
        )}

        <div className="flex items-center justify-between pt-1">
          <p className="text-[11px] text-[#BCBAB6]">
            변수는 생성 시 자동으로 치환됩니다
          </p>
          <div className="flex gap-2">
            <GlassButton variant="ghost" size="sm" onClick={onClose}>
              취소
            </GlassButton>
            <GlassButton
              variant="primary"
              size="sm"
              onClick={handleSave}
              loading={saving}
              disabled={saving || loading}
              className="min-w-[72px]"
            >
              {saved ? "저장됨 ✓" : "저장"}
            </GlassButton>
          </div>
        </div>
      </div>
    </div>
  );
}

function EditIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#9CA3AF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
      <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
    </svg>
  );
}

function CloseIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
      <path d="M18 6 6 18M6 6l12 12" />
    </svg>
  );
}
