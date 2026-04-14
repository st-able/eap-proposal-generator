"use client";

import { useState, FormEvent } from "react";
import { GlassInput } from "@/components/ui/GlassInput";
import { GlassButton } from "@/components/ui/GlassButton";
import { StatusIndicator } from "@/components/ui/LoadingPulse";
import type { GenerateStatus } from "@/types";

interface GeneratorFormProps {
  onGenerate: (url: string) => void;
  status: GenerateStatus;
  defaultUrl?: string;
}

export function GeneratorForm({ onGenerate, status, defaultUrl = "" }: GeneratorFormProps) {
  const [url, setUrl] = useState(defaultUrl);
  const [urlError, setUrlError] = useState("");

  const isLoading = status === "scraping" || status === "generating";

  function validateUrl(value: string): boolean {
    try {
      const parsed = new URL(value);
      if (!["http:", "https:"].includes(parsed.protocol)) {
        setUrlError("http:// 또는 https://로 시작하는 URL을 입력해주세요.");
        return false;
      }
      setUrlError("");
      return true;
    } catch {
      setUrlError("유효하지 않은 URL 형식입니다.");
      return false;
    }
  }

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    const trimmed = url.trim();
    if (!trimmed) {
      setUrlError("URL을 입력해주세요.");
      return;
    }
    if (!validateUrl(trimmed)) return;
    onGenerate(trimmed);
  }

  return (
    <div className="bg-white border border-[#EDECE9] rounded-2xl shadow-[0_2px_8px_rgba(0,0,0,0.07)] p-5">
      <form onSubmit={handleSubmit}>
        <label className="block text-[11px] font-semibold text-[#9CA3AF] uppercase tracking-widest mb-3">
          고객사 웹사이트 URL
        </label>
        <div className="flex gap-2.5">
          <div className="flex-1">
            <GlassInput
              type="url"
              placeholder="https://www.company.co.kr"
              value={url}
              onChange={(e) => {
                setUrl(e.target.value);
                if (urlError) setUrlError("");
              }}
              onBlur={() => url && validateUrl(url)}
              disabled={isLoading}
              className="h-11"
              autoComplete="url"
            />
            {urlError && (
              <p className="mt-1.5 text-xs text-red-500 flex items-center gap-1">
                <span>⚠</span> {urlError}
              </p>
            )}
          </div>
          <GlassButton
            type="submit"
            variant="primary"
            loading={isLoading}
            disabled={isLoading}
            className="h-11 px-5 shrink-0 font-semibold text-[13px]"
          >
            {isLoading ? "생성 중" : "제안서 생성 →"}
          </GlassButton>
        </div>

        {(status === "scraping" || status === "generating") && (
          <div className="mt-3 pt-3 border-t border-[#F0EFEC]">
            <StatusIndicator status={status} />
          </div>
        )}
      </form>
    </div>
  );
}
