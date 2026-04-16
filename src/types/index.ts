export interface Proposal {
  id: string;
  client_url: string;
  client_name: string | null;
  scraped_content: string | null;
  prompt_used: string | null;
  proposal_markdown: string;
  created_at: string;
}

export interface ProposalSummary {
  id: string;
  client_url: string;
  client_name: string | null;
  created_at: string;
}

export interface PromptTemplate {
  id: string;
  name: string;
  template: string;
  updated_at: string;
}

export interface ScrapeResult {
  content: string;
  title: string;
}

export type GenerateStatus =
  | "idle"
  | "scraping"
  | "generating"
  | "done"
  | "error";

// 슬라이드 관련 타입
export interface SlideClientData {
  client_analysis: {
    bullets: string[];
    risk_factors: string[];
  };
  eap_need: {
    bullets: string[];
  };
  proposed_program: {
    items: { name: string; desc: string }[];
  };
  expected_effects: {
    stats: { label: string; value: string }[];
    bullets: string[];
  };
}

export interface SlidePresentation {
  id: string;
  proposal_id: string;
  slides_json: SlideClientData;
  created_at: string;
}

export type SlideStatus = "idle" | "generating" | "done" | "error";
