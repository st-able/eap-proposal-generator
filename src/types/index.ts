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
