import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "EAP 제안서 생성기",
  description:
    "고객사 웹사이트를 분석하여 AI가 맞춤형 EAP(근로자 지원 프로그램) 제안서를 자동 생성합니다.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ko">
      <body className="antialiased">{children}</body>
    </html>
  );
}
