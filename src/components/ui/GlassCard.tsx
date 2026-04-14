import { ReactNode } from "react";
import { cn } from "@/lib/cn";

interface GlassCardProps {
  children: ReactNode;
  className?: string;
  strong?: boolean;
  hover?: boolean;
  onClick?: () => void;
}

export function GlassCard({
  children,
  className,
  strong = false,
  hover = false,
  onClick,
}: GlassCardProps) {
  return (
    <div
      onClick={onClick}
      className={cn(
        "bg-white border border-[#EDECE9] rounded-2xl",
        strong
          ? "shadow-[0_2px_8px_rgba(0,0,0,0.07)]"
          : "shadow-[0_1px_3px_rgba(0,0,0,0.05)]",
        hover &&
          "cursor-pointer transition-all duration-200 hover:shadow-[0_4px_16px_rgba(0,0,0,0.09)] hover:-translate-y-px",
        "p-5",
        className
      )}
    >
      {children}
    </div>
  );
}
