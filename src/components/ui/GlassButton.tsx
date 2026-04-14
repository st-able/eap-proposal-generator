"use client";

import { ButtonHTMLAttributes, ReactNode } from "react";
import { cn } from "@/lib/cn";

interface GlassButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  variant?: "primary" | "ghost" | "danger";
  size?: "sm" | "md" | "lg";
  loading?: boolean;
}

export function GlassButton({
  children,
  variant = "ghost",
  size = "md",
  loading = false,
  className,
  disabled,
  ...props
}: GlassButtonProps) {
  const base =
    "inline-flex items-center justify-center gap-2 font-medium transition-all duration-200 rounded-xl disabled:opacity-40 disabled:cursor-not-allowed select-none cursor-pointer";

  const variants = {
    primary:
      "bg-[#E07B65] text-white hover:bg-[#CF6A55] active:bg-[#BF5A45] shadow-sm hover:shadow-[0_4px_14px_rgba(224,123,101,0.35)] active:scale-[0.98]",
    ghost:
      "bg-white border border-[#EDECE9] text-[#5C5C5C] hover:bg-[#F9F8F5] hover:border-[#E0DFDB] hover:text-[#1C1C1C] active:scale-[0.98] shadow-sm",
    danger:
      "bg-red-50 border border-red-200 text-red-600 hover:bg-red-100 hover:border-red-300 active:scale-[0.98]",
  };

  const sizes = {
    sm: "px-3 py-1.5 text-xs h-8",
    md: "px-4 py-2 text-sm h-9",
    lg: "px-6 py-2.5 text-sm h-11",
  };

  return (
    <button
      {...props}
      disabled={disabled || loading}
      className={cn(base, variants[variant], sizes[size], className)}
    >
      {loading && (
        <svg
          className="animate-spin h-3.5 w-3.5 shrink-0"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          />
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
          />
        </svg>
      )}
      {children}
    </button>
  );
}
