"use client";

import { InputHTMLAttributes, TextareaHTMLAttributes, forwardRef } from "react";
import { cn } from "@/lib/cn";

const inputBase =
  "w-full bg-white border border-[#EDECE9] rounded-xl text-[#1C1C1C] placeholder:text-[#BCBAB6] focus:outline-none focus:border-[#E07B65] focus:ring-2 focus:ring-[#E07B65]/10 transition-all duration-200 font-['Pretendard',sans-serif]";

interface GlassInputProps extends InputHTMLAttributes<HTMLInputElement> {
  className?: string;
}

export const GlassInput = forwardRef<HTMLInputElement, GlassInputProps>(
  ({ className, ...props }, ref) => {
    return (
      <input
        ref={ref}
        className={cn(inputBase, "px-4 py-2.5 text-sm shadow-sm", className)}
        {...props}
      />
    );
  }
);
GlassInput.displayName = "GlassInput";

interface GlassTextareaProps
  extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  className?: string;
}

export const GlassTextarea = forwardRef<
  HTMLTextAreaElement,
  GlassTextareaProps
>(({ className, ...props }, ref) => {
  return (
    <textarea
      ref={ref}
      className={cn(
        inputBase,
        "px-4 py-3 text-sm resize-none font-mono leading-relaxed shadow-sm",
        className
      )}
      {...props}
    />
  );
});
GlassTextarea.displayName = "GlassTextarea";
