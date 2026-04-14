import { cn } from "@/lib/cn";

interface LoadingPulseProps {
  lines?: number;
  className?: string;
}

export function LoadingPulse({ lines = 5, className }: LoadingPulseProps) {
  const widths = ["w-full", "w-5/6", "w-4/5", "w-full", "w-3/4"];
  return (
    <div className={cn("space-y-3 animate-pulse", className)}>
      {Array.from({ length: lines }).map((_, i) => (
        <div
          key={i}
          className={cn(
            "h-3 rounded-lg bg-[#EDECE9]",
            widths[i % widths.length]
          )}
        />
      ))}
    </div>
  );
}

export function StatusIndicator({
  status,
}: {
  status: "scraping" | "generating";
}) {
  const messages = {
    scraping: "웹사이트 분석 중...",
    generating: "제안서 생성 중...",
  };

  return (
    <div className="flex items-center gap-2.5 text-[#9CA3AF] text-sm">
      <span className="relative flex h-2 w-2">
        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#E07B65] opacity-60" />
        <span className="relative inline-flex rounded-full h-2 w-2 bg-[#E07B65]" />
      </span>
      {messages[status]}
    </div>
  );
}
