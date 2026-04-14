import * as cheerio from "cheerio";
import type { ScrapeResult } from "@/types";

const MAX_CONTENT_LENGTH = 8000;
const FETCH_TIMEOUT_MS = 10000;

export async function scrapeWebsite(url: string): Promise<ScrapeResult> {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), FETCH_TIMEOUT_MS);

  let response: Response;
  try {
    response = await fetch(url, {
      signal: controller.signal,
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
        Accept:
          "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
        "Accept-Language": "ko-KR,ko;q=0.9,en;q=0.8",
      },
    });
  } catch (error: unknown) {
    if (error instanceof Error && error.name === "AbortError") {
      throw new Error("웹사이트 요청 시간이 초과되었습니다 (10초).");
    }
    throw new Error(`웹사이트에 연결할 수 없습니다: ${url}`);
  } finally {
    clearTimeout(timeoutId);
  }

  if (!response.ok) {
    throw new Error(
      `웹사이트 응답 오류: ${response.status} ${response.statusText}`
    );
  }

  const contentType = response.headers.get("content-type") || "";
  if (!contentType.includes("text/html")) {
    throw new Error(
      `HTML이 아닌 컨텐츠 타입: ${contentType}. HTML 페이지 URL을 입력해주세요.`
    );
  }

  const html = await response.text();
  const $ = cheerio.load(html);

  // 불필요한 요소 제거
  $(
    "script, style, nav, footer, header, aside, iframe, noscript, [aria-hidden='true']"
  ).remove();
  $("[class*='cookie'], [class*='popup'], [class*='modal'], [id*='cookie']").remove();

  const title =
    $("title").text().trim() ||
    $("h1").first().text().trim() ||
    new URL(url).hostname;

  // 메인 콘텐츠 추출 우선순위
  const mainSelectors = [
    "main",
    "article",
    '[role="main"]',
    "#content",
    ".content",
    "#main",
    ".main",
    "body",
  ];

  let rawText = "";
  for (const selector of mainSelectors) {
    const el = $(selector);
    if (el.length > 0) {
      rawText = el
        .text()
        .replace(/\s+/g, " ")
        .trim();
      if (rawText.length > 200) break;
    }
  }

  if (!rawText) {
    rawText = $("body").text().replace(/\s+/g, " ").trim();
  }

  const content =
    rawText.length > MAX_CONTENT_LENGTH
      ? rawText.slice(0, MAX_CONTENT_LENGTH) + "\n\n[내용이 잘려서 표시됩니다]"
      : rawText;

  return { content, title };
}
