"use client";

import { useState, useEffect, useCallback } from "react";
import { MAJU_INFO } from "@/lib/data/maju-info";
import type { SlideClientData } from "@/types";

interface SlideViewerProps {
  clientName: string;
  clientUrl: string;
  proposalDate: string;
  data: SlideClientData;
  onClose: () => void;
}

// ─── 공통 슬라이드 레이아웃 ───────────────────────────────────────────
function SlideShell({ children, className = "", style }: { children: React.ReactNode; className?: string; style?: React.CSSProperties }) {
  return (
    <div
      className={`relative w-full flex flex-col overflow-hidden ${className}`}
      style={{ aspectRatio: "16/9", background: "#F5F4F0", ...style }}
    >
      {children}
    </div>
  );
}

function SlideHeader({ title, subtitle }: { title: string; subtitle?: string }) {
  return (
    <div className="px-10 pt-8 pb-4 border-b border-[#EDECE9]">
      <div className="flex items-center gap-2 mb-1">
        <span
          className="inline-block w-1 h-5 rounded-full"
          style={{ background: "#E07B65" }}
        />
        <h2 className="text-[1.1vw] font-bold" style={{ color: "#3D4A5C" }}>
          {title}
        </h2>
      </div>
      {subtitle && (
        <p className="text-[0.75vw] ml-3" style={{ color: "#9CA3AF" }}>
          {subtitle}
        </p>
      )}
    </div>
  );
}

function MajuLogo({ size = "sm" }: { size?: "sm" | "lg" }) {
  const sz = size === "lg" ? "text-[2.5vw]" : "text-[0.9vw]";
  return (
    <span className={`font-bold tracking-tight ${sz}`} style={{ color: "#E07B65" }}>
      마주심리상담소
    </span>
  );
}

// ─── 슬라이드 1: 커버 ────────────────────────────────────────────────
function SlideCover({ clientName, proposalDate }: { clientName: string; proposalDate: string }) {
  return (
    <SlideShell className="items-center justify-center" style={{ background: "#3D4A5C" }}>
      <div
        className="absolute inset-0 flex flex-col items-center justify-center"
        style={{ background: "#3D4A5C" }}
      >
        {/* 배경 장식 */}
        <div
          className="absolute bottom-0 right-0 w-1/3 h-full opacity-10"
          style={{ background: "radial-gradient(circle at bottom right, #E07B65, transparent 70%)" }}
        />
        <div className="relative z-10 text-center px-12">
          <div className="mb-6">
            <MajuLogo size="lg" />
            <p className="text-[0.9vw] mt-1" style={{ color: "rgba(255,255,255,0.6)" }}>
              {MAJU_INFO.slogan}
            </p>
          </div>
          <div
            className="w-16 h-px mx-auto mb-6"
            style={{ background: "#E07B65" }}
          />
          <h1 className="text-[2vw] font-bold mb-3" style={{ color: "#FFFFFF" }}>
            EAP 도입 제안서
          </h1>
          <p className="text-[1.2vw] font-medium mb-8" style={{ color: "rgba(255,255,255,0.85)" }}>
            {clientName} 귀중
          </p>
          <div
            className="inline-block px-5 py-2 rounded-full text-[0.75vw]"
            style={{ background: "rgba(224,123,101,0.2)", color: "#E07B65", border: "1px solid rgba(224,123,101,0.3)" }}
          >
            제안일: {proposalDate}
          </div>
        </div>
      </div>
    </SlideShell>
  );
}

// ─── 슬라이드 2: 귀사 현황 분석 ──────────────────────────────────────
function SlideClientAnalysis({ data, clientName }: { data: SlideClientData; clientName: string }) {
  return (
    <SlideShell>
      <SlideHeader title="귀사 현황 분석" subtitle={clientName} />
      <div className="flex flex-1 gap-4 px-10 py-5 overflow-hidden">
        <div className="flex-1">
          <p className="text-[0.7vw] font-semibold uppercase tracking-widest mb-3" style={{ color: "#9CA3AF" }}>
            기업 현황
          </p>
          <ul className="space-y-2">
            {data.client_analysis.bullets.map((b, i) => (
              <li key={i} className="flex items-start gap-2">
                <span className="mt-1 w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: "#E07B65" }} />
                <span className="text-[0.75vw] leading-relaxed" style={{ color: "#3D4A5C" }}>{b}</span>
              </li>
            ))}
          </ul>
        </div>
        <div className="w-px" style={{ background: "#EDECE9" }} />
        <div className="flex-1">
          <p className="text-[0.7vw] font-semibold uppercase tracking-widest mb-3" style={{ color: "#9CA3AF" }}>
            예상 심리 리스크 요인
          </p>
          <ul className="space-y-2">
            {data.client_analysis.risk_factors.map((r, i) => (
              <li
                key={i}
                className="flex items-start gap-2 px-3 py-2 rounded-lg"
                style={{ background: "#FDF0ED", border: "1px solid #F5C5BA" }}
              >
                <span className="text-[0.7vw] font-bold" style={{ color: "#E07B65" }}>⚠</span>
                <span className="text-[0.72vw] leading-relaxed" style={{ color: "#5C3D35" }}>{r}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
      <SlideFooter />
    </SlideShell>
  );
}

// ─── 슬라이드 3: EAP 도입 필요성 ─────────────────────────────────────
function SlideEapNeed({ data, clientName }: { data: SlideClientData; clientName: string }) {
  return (
    <SlideShell>
      <SlideHeader title="EAP 도입 필요성" subtitle={`${clientName} 특성 기반 분석`} />
      <div className="flex-1 px-10 py-5 overflow-hidden">
        <div className="grid grid-cols-2 gap-3 h-full">
          {data.eap_need.bullets.map((b, i) => (
            <div
              key={i}
              className="flex items-start gap-3 p-4 rounded-xl"
              style={{ background: "#FFFFFF", border: "1px solid #EDECE9", boxShadow: "0 1px 3px rgba(0,0,0,0.04)" }}
            >
              <span
                className="flex-shrink-0 w-5 h-5 rounded-full flex items-center justify-center text-[0.6vw] font-bold"
                style={{ background: "#E07B65", color: "#FFFFFF" }}
              >
                {i + 1}
              </span>
              <p className="text-[0.72vw] leading-relaxed" style={{ color: "#3D4A5C" }}>{b}</p>
            </div>
          ))}
        </div>
      </div>
      <SlideFooter />
    </SlideShell>
  );
}

// ─── 슬라이드 4: EAP란? ──────────────────────────────────────────────
function SlideWhatIsEap() {
  return (
    <SlideShell>
      <SlideHeader title="EAP란?" subtitle="Employee Assistance Program — 기업상담" />
      <div className="flex-1 px-10 py-4 overflow-hidden">
        <p className="text-[0.8vw] mb-5 font-medium" style={{ color: "#5C5C5C" }}>
          회사가 소속 임직원을 돕는 일입니다
        </p>
        <div className="grid grid-cols-4 gap-3 h-[65%]">
          {MAJU_INFO.eap.effects.map((effect, i) => (
            <div
              key={i}
              className="flex flex-col gap-2 p-4 rounded-xl"
              style={{ background: "#FFFFFF", border: "1px solid #EDECE9" }}
            >
              <p className="text-[0.75vw] font-bold" style={{ color: "#3D4A5C" }}>{effect.title}</p>
              <ul className="space-y-1">
                {effect.bullets.map((b, j) => (
                  <li key={j} className="flex items-start gap-1.5">
                    <span className="text-[0.55vw] mt-0.5" style={{ color: "#E07B65" }}>·</span>
                    <span className="text-[0.62vw] leading-snug" style={{ color: "#5C5C5C" }}>{b}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
      <SlideFooter />
    </SlideShell>
  );
}

// ─── 슬라이드 5: 마주심리상담소 소개 ─────────────────────────────────
function SlideMajuIntro() {
  return (
    <SlideShell>
      <SlideHeader title="마주심리상담소 소개" />
      <div className="flex flex-1 gap-4 px-10 py-4 overflow-hidden">
        <div className="flex-1 flex flex-col gap-3">
          <div className="p-4 rounded-xl" style={{ background: "#FFFFFF", border: "1px solid #EDECE9" }}>
            <p className="text-[0.65vw] font-semibold mb-1" style={{ color: "#9CA3AF" }}>위치</p>
            <p className="text-[0.72vw]" style={{ color: "#3D4A5C" }}>{MAJU_INFO.address}</p>
          </div>
          <div className="p-4 rounded-xl" style={{ background: "#FFFFFF", border: "1px solid #EDECE9" }}>
            <p className="text-[0.65vw] font-semibold mb-1" style={{ color: "#9CA3AF" }}>운영시간</p>
            <p className="text-[0.72vw]" style={{ color: "#3D4A5C" }}>{MAJU_INFO.hours.weekday}</p>
            <p className="text-[0.72vw]" style={{ color: "#3D4A5C" }}>{MAJU_INFO.hours.saturday}</p>
          </div>
          <div className="p-4 rounded-xl flex-1" style={{ background: "#FDF0ED", border: "1px solid #F5C5BA" }}>
            <p className="text-[0.65vw] font-semibold mb-2" style={{ color: "#E07B65" }}>
              상담사 자격 현황 (2026.02 기준)
            </p>
            {MAJU_INFO.counselors.certifications.map((c, i) => (
              <div key={i} className="flex justify-between items-center mb-1">
                <span className="text-[0.62vw]" style={{ color: "#5C3D35" }}>{c.org}</span>
                <span className="text-[0.62vw] font-bold" style={{ color: "#E07B65" }}>
                  {c.level1 > 0 ? `1급 ${c.level1}명 ` : ""}
                  {c.level2 > 0 ? `2급 ${c.level2}명` : ""}
                </span>
              </div>
            ))}
          </div>
        </div>
        <div className="w-px" style={{ background: "#EDECE9" }} />
        <div className="flex-1 flex flex-col gap-3">
          <div
            className="p-4 rounded-xl text-center"
            style={{ background: "#3D4A5C", color: "#FFFFFF" }}
          >
            <p className="text-[2vw] font-bold" style={{ color: "#E07B65" }}>9</p>
            <p className="text-[0.65vw]">분야별 심리 전문가</p>
          </div>
          <div className="p-4 rounded-xl flex-1" style={{ background: "#FFFFFF", border: "1px solid #EDECE9" }}>
            <p className="text-[0.65vw] font-semibold mb-2" style={{ color: "#9CA3AF" }}>주요 파트너사</p>
            <ul className="space-y-1">
              {MAJU_INFO.partners.slice(0, 6).map((p, i) => (
                <li key={i} className="flex items-center gap-1.5">
                  <span className="w-1 h-1 rounded-full flex-shrink-0" style={{ background: "#E07B65" }} />
                  <span className="text-[0.62vw]" style={{ color: "#5C5C5C" }}>{p}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
      <SlideFooter />
    </SlideShell>
  );
}

// ─── 슬라이드 6: 마주의 EAP 서비스 ──────────────────────────────────
function SlideMajuServices() {
  return (
    <SlideShell>
      <SlideHeader title="마주의 EAP 서비스" />
      <div className="flex-1 px-10 py-4 overflow-hidden">
        <div className="grid grid-cols-3 gap-3 h-[85%]">
          {MAJU_INFO.services.map((svc, i) => (
            <div
              key={i}
              className="p-4 rounded-xl flex flex-col"
              style={{ background: "#FFFFFF", border: "1px solid #EDECE9" }}
            >
              <div className="flex items-center gap-2 mb-3">
                <span
                  className="w-5 h-5 rounded-full flex items-center justify-center text-[0.55vw] font-bold flex-shrink-0"
                  style={{ background: "#E07B65", color: "#FFFFFF" }}
                >
                  {i + 1}
                </span>
                <p className="text-[0.75vw] font-bold" style={{ color: "#3D4A5C" }}>{svc.title}</p>
              </div>
              <ul className="space-y-1.5 flex-1">
                {svc.items.map((item, j) => (
                  <li key={j} className="flex items-start gap-1.5">
                    <span className="text-[0.55vw] mt-0.5 flex-shrink-0" style={{ color: "#E07B65" }}>·</span>
                    <span className="text-[0.62vw] leading-snug" style={{ color: "#5C5C5C" }}>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
      <SlideFooter />
    </SlideShell>
  );
}

// ─── 슬라이드 7: 제안 프로그램 구성 ──────────────────────────────────
function SlideProposedProgram({ data, clientName }: { data: SlideClientData; clientName: string }) {
  return (
    <SlideShell>
      <SlideHeader title="제안 프로그램 구성" subtitle={`${clientName} 맞춤 구성`} />
      <div className="flex-1 px-10 py-4 overflow-hidden">
        <div className="grid grid-cols-2 gap-3 h-[85%]">
          {data.proposed_program.items.map((item, i) => (
            <div
              key={i}
              className="flex gap-3 p-4 rounded-xl"
              style={{ background: "#FFFFFF", border: "1px solid #EDECE9" }}
            >
              <div
                className="flex-shrink-0 w-7 h-7 rounded-lg flex items-center justify-center text-[0.65vw] font-bold"
                style={{ background: "#FDF0ED", color: "#E07B65" }}
              >
                {String.fromCharCode(64 + i + 1)}
              </div>
              <div>
                <p className="text-[0.72vw] font-bold mb-1" style={{ color: "#3D4A5C" }}>{item.name}</p>
                <p className="text-[0.65vw] leading-relaxed" style={{ color: "#5C5C5C" }}>{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
      <SlideFooter />
    </SlideShell>
  );
}

// ─── 슬라이드 8: 기대 효과 ────────────────────────────────────────────
function SlideExpectedEffects({ data }: { data: SlideClientData }) {
  return (
    <SlideShell>
      <SlideHeader title="기대 효과" />
      <div className="flex-1 px-10 py-4 overflow-hidden">
        <div className="grid grid-cols-4 gap-3 mb-4">
          {data.expected_effects.stats.map((stat, i) => (
            <div
              key={i}
              className="p-3 rounded-xl text-center"
              style={{ background: "#3D4A5C" }}
            >
              <p className="text-[1.4vw] font-bold" style={{ color: "#E07B65" }}>{stat.value}</p>
              <p className="text-[0.55vw] mt-1" style={{ color: "rgba(255,255,255,0.7)" }}>{stat.label}</p>
            </div>
          ))}
        </div>
        <div className="p-4 rounded-xl" style={{ background: "#FFFFFF", border: "1px solid #EDECE9" }}>
          <p className="text-[0.65vw] font-semibold mb-2" style={{ color: "#9CA3AF" }}>추가 기대 효과</p>
          <ul className="grid grid-cols-3 gap-x-4 gap-y-1.5">
            {data.expected_effects.bullets.map((b, i) => (
              <li key={i} className="flex items-start gap-1.5">
                <span className="w-1 h-1 rounded-full flex-shrink-0 mt-1.5" style={{ background: "#E07B65" }} />
                <span className="text-[0.65vw] leading-snug" style={{ color: "#3D4A5C" }}>{b}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
      <SlideFooter />
    </SlideShell>
  );
}

// ─── 슬라이드 9: 비용 및 운영 안내 ───────────────────────────────────
function SlidePricing() {
  return (
    <SlideShell>
      <SlideHeader title="비용 및 운영 안내" />
      <div className="flex flex-1 gap-4 px-10 py-4 overflow-hidden">
        <div className="flex-1 flex flex-col gap-3">
          <div
            className="p-5 rounded-xl text-center"
            style={{ background: "#3D4A5C" }}
          >
            <p className="text-[0.65vw] mb-1" style={{ color: "rgba(255,255,255,0.6)" }}>EAP 상담료 균일가</p>
            <p className="text-[2.5vw] font-bold" style={{ color: "#E07B65" }}>
              {MAJU_INFO.eap.pricePerSession.toLocaleString()}원
            </p>
            <p className="text-[0.6vw] mt-1" style={{ color: "rgba(255,255,255,0.5)" }}>
              (일반 상담료 {MAJU_INFO.eap.regularPrice})
            </p>
          </div>
          <div className="p-4 rounded-xl flex-1" style={{ background: "#FFFFFF", border: "1px solid #EDECE9" }}>
            <p className="text-[0.65vw] font-semibold mb-2" style={{ color: "#9CA3AF" }}>기업 고객 혜택</p>
            {MAJU_INFO.eap.benefits.map((b, i) => (
              <div key={i} className="flex items-start gap-2 mb-2">
                <span
                  className="flex-shrink-0 w-3.5 h-3.5 rounded flex items-center justify-center"
                  style={{ background: "#E07B65" }}
                >
                  <svg width="7" height="7" viewBox="0 0 10 8" fill="none">
                    <path d="M1 4L3.5 6.5L9 1" stroke="white" strokeWidth="1.5" strokeLinecap="round" />
                  </svg>
                </span>
                <span className="text-[0.65vw] leading-snug" style={{ color: "#3D4A5C" }}>{b}</span>
              </div>
            ))}
          </div>
        </div>
        <div className="w-px" style={{ background: "#EDECE9" }} />
        <div className="flex-1">
          <p className="text-[0.65vw] font-semibold mb-3" style={{ color: "#9CA3AF" }}>진행 프로세스</p>
          <div className="flex flex-col gap-3">
            {MAJU_INFO.process.map((p, i) => (
              <div key={i} className="flex items-start gap-3">
                <span
                  className="flex-shrink-0 w-5 h-5 rounded-full flex items-center justify-center text-[0.55vw] font-bold"
                  style={{ background: "#FDF0ED", color: "#E07B65", border: "1px solid #F5C5BA" }}
                >
                  {i + 1}
                </span>
                <div>
                  <p className="text-[0.65vw] font-bold" style={{ color: "#3D4A5C" }}>{p.title}</p>
                  <p className="text-[0.6vw]" style={{ color: "#9CA3AF" }}>{p.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      <SlideFooter />
    </SlideShell>
  );
}

// ─── 슬라이드 10: 연락처 ─────────────────────────────────────────────
function SlideContact() {
  return (
    <SlideShell className="items-center justify-center" style={{ background: "#3D4A5C" }}>
      <div
        className="absolute inset-0 flex flex-col items-center justify-center"
        style={{ background: "#3D4A5C" }}
      >
        <div
          className="absolute top-0 left-0 w-1/3 h-full opacity-10"
          style={{ background: "radial-gradient(circle at top left, #E07B65, transparent 70%)" }}
        />
        <div className="relative z-10 text-center">
          <MajuLogo size="lg" />
          <p className="text-[0.85vw] mt-1 mb-8" style={{ color: "rgba(255,255,255,0.5)" }}>
            {MAJU_INFO.slogan}
          </p>
          <div className="grid grid-cols-2 gap-4 text-left max-w-lg mx-auto">
            {[
              { label: "전화", value: `${MAJU_INFO.contact.phone} / ${MAJU_INFO.contact.mobile}` },
              { label: "이메일", value: MAJU_INFO.contact.email },
              { label: "웹사이트", value: MAJU_INFO.contact.website },
              { label: "카카오톡", value: MAJU_INFO.contact.kakao },
            ].map((item, i) => (
              <div key={i} className="px-4 py-3 rounded-lg" style={{ background: "rgba(255,255,255,0.07)" }}>
                <p className="text-[0.55vw] mb-0.5" style={{ color: "rgba(255,255,255,0.4)" }}>{item.label}</p>
                <p className="text-[0.65vw]" style={{ color: "rgba(255,255,255,0.9)" }}>{item.value}</p>
              </div>
            ))}
          </div>
          <p className="mt-6 text-[0.65vw]" style={{ color: "rgba(255,255,255,0.4)" }}>
            {MAJU_INFO.address}
          </p>
        </div>
      </div>
    </SlideShell>
  );
}

// ─── 슬라이드 하단 푸터 ──────────────────────────────────────────────
function SlideFooter() {
  return (
    <div
      className="px-10 py-2 flex items-center justify-between flex-shrink-0"
      style={{ borderTop: "1px solid #EDECE9" }}
    >
      <MajuLogo size="sm" />
      <p className="text-[0.55vw]" style={{ color: "#BCBAB6" }}>
        {MAJU_INFO.contact.website}
      </p>
    </div>
  );
}

// ─── 메인 SlideViewer ────────────────────────────────────────────────
export function SlideViewer({ clientName, clientUrl, proposalDate, data, onClose }: SlideViewerProps) {
  const [current, setCurrent] = useState(0);

  const slides = [
    <SlideCover key="cover" clientName={clientName} proposalDate={proposalDate} />,
    <SlideClientAnalysis key="analysis" data={data} clientName={clientName} />,
    <SlideEapNeed key="need" data={data} clientName={clientName} />,
    <SlideWhatIsEap key="what" />,
    <SlideMajuIntro key="intro" />,
    <SlideMajuServices key="services" />,
    <SlideProposedProgram key="program" data={data} clientName={clientName} />,
    <SlideExpectedEffects key="effects" data={data} />,
    <SlidePricing key="pricing" />,
    <SlideContact key="contact" />,
  ];

  const prev = useCallback(() => setCurrent((c) => Math.max(0, c - 1)), []);
  const next = useCallback(() => setCurrent((c) => Math.min(slides.length - 1, c + 1)), [slides.length]);

  useEffect(() => {
    function handleKey(e: KeyboardEvent) {
      if (e.key === "ArrowLeft") prev();
      else if (e.key === "ArrowRight") next();
      else if (e.key === "Escape") onClose();
    }
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [prev, next, onClose]);

  function handlePrint() {
    window.print();
  }

  return (
    <>
      {/* 인쇄용 스타일 */}
      <style>{`
        @media print {
          body > *:not(#slide-print-root) { display: none !important; }
          #slide-print-root { position: fixed; inset: 0; z-index: 9999; }
          .slide-print-page { page-break-after: always; width: 100vw; height: 100vh; display: flex; align-items: center; justify-content: center; }
          .slide-print-controls { display: none !important; }
        }
      `}</style>

      {/* 오버레이 */}
      <div
        className="fixed inset-0 z-50 flex flex-col"
        style={{ background: "rgba(0,0,0,0.85)" }}
        id="slide-print-root"
      >
        {/* 컨트롤 바 */}
        <div
          className="slide-print-controls flex items-center justify-between px-6 py-3 flex-shrink-0"
          style={{ background: "#1C1C1C" }}
        >
          <div className="flex items-center gap-3">
            <span className="text-[13px] font-semibold text-white">{clientName} EAP 제안서</span>
            <span className="text-[11px] text-gray-500">
              {current + 1} / {slides.length}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[12px] font-medium transition-colors"
              style={{ background: "#E07B65", color: "#FFFFFF" }}
            >
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polyline points="6 9 6 2 18 2 18 9" />
                <path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2" />
                <rect x="6" y="14" width="12" height="8" />
              </svg>
              PDF 저장
            </button>
            <button
              onClick={onClose}
              className="px-3 py-1.5 rounded-lg text-[12px] font-medium transition-colors"
              style={{ background: "rgba(255,255,255,0.08)", color: "#9CA3AF" }}
            >
              닫기 (ESC)
            </button>
          </div>
        </div>

        {/* 슬라이드 영역 */}
        <div className="flex-1 flex items-center justify-center p-6 overflow-hidden">
          <div className="relative w-full" style={{ maxWidth: "calc((100vh - 120px) * 16 / 9)" }}>
            {/* 현재 슬라이드 */}
            <div className="rounded-xl overflow-hidden shadow-2xl">
              {slides[current]}
            </div>

            {/* 인쇄용 전체 슬라이드 (숨김) */}
            <div className="hidden print:block">
              {slides.map((slide, i) => (
                <div key={i} className="slide-print-page">
                  {slide}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* 네비게이션 */}
        <div
          className="slide-print-controls flex items-center justify-center gap-4 py-4 flex-shrink-0"
          style={{ background: "#1C1C1C" }}
        >
          <button
            onClick={prev}
            disabled={current === 0}
            className="px-4 py-2 rounded-lg text-[13px] font-medium transition-colors disabled:opacity-30"
            style={{ background: "rgba(255,255,255,0.08)", color: "#FFFFFF" }}
          >
            ← 이전
          </button>

          {/* 슬라이드 인디케이터 */}
          <div className="flex items-center gap-1.5">
            {slides.map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrent(i)}
                className="rounded-full transition-all"
                style={{
                  width: i === current ? "20px" : "6px",
                  height: "6px",
                  background: i === current ? "#E07B65" : "rgba(255,255,255,0.3)",
                }}
              />
            ))}
          </div>

          <button
            onClick={next}
            disabled={current === slides.length - 1}
            className="px-4 py-2 rounded-lg text-[13px] font-medium transition-colors disabled:opacity-30"
            style={{ background: "rgba(255,255,255,0.08)", color: "#FFFFFF" }}
          >
            다음 →
          </button>
        </div>
      </div>
    </>
  );
}
