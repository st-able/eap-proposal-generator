-- proposals 테이블
create table if not exists proposals (
  id                uuid primary key default gen_random_uuid(),
  client_url        text not null,
  client_name       text,
  scraped_content   text,
  prompt_used       text,
  proposal_markdown text not null,
  created_at        timestamptz default now()
);

create index if not exists proposals_created_at_idx on proposals(created_at desc);

-- prompt_templates 테이블
create table if not exists prompt_templates (
  id         uuid primary key default gen_random_uuid(),
  name       text not null default 'default',
  template   text not null,
  updated_at timestamptz default now()
);

create unique index if not exists prompt_templates_name_idx on prompt_templates(name);

-- RLS 비활성화 (회원가입 없는 공개 앱)
alter table proposals disable row level security;
alter table prompt_templates disable row level security;

-- 기본 EAP 프롬프트 삽입
insert into prompt_templates (name, template) values (
  'default',
  '당신은 기업 심리상담 및 EAP(근로자 지원 프로그램) 전문 컨설턴트입니다.

아래 기업의 웹사이트 내용을 분석하여, 해당 기업에 특화된 EAP 도입 제안서를 작성해주세요.

[잠재 고객사 정보]
- 기업명: {{client_name}}
- 웹사이트: {{client_url}}

[웹사이트 분석 내용]
{{scraped_content}}

위 정보를 바탕으로 다음 구조에 따라 전문적인 EAP 제안서를 Markdown으로 작성해주세요.
기업의 업종, 규모, 조직 문화 등을 분석하여 해당 기업에 적합한 맞춤형 내용을 작성하세요.

---

# EAP 도입 제안서

**제안 기업:** {{client_name}}
**제안 기관:** [심리상담 기관명]
**제안일:** [작성일]

---

## 1. 귀사 현황 분석
(업종·사업 특성, 임직원 규모 추정, 업무 환경 특성, 예상되는 심리적 리스크 요인)

## 2. EAP 도입 필요성
(해당 업종/기업 특성에서 나타나는 직원 심리 건강 이슈, 이로 인한 생산성·이직률 영향)

## 3. 제안 프로그램 구성
(개인 상담, 집단 프로그램, 관리자 코칭, 위기 개입 등 기업 특성에 맞게 구성)

## 4. 기대 효과
(직원 심리 건강 향상, 이직률 감소, 생산성 향상, 조직 문화 개선 등 수치 포함)

## 5. 서비스 운영 방식
(상담 방식, 비밀 보장 원칙, 접근 채널, 운영 일정)

## 6. 비용 및 계약 안내
(규모별 예상 비용 구조, 계약 기간, 성과 측정 방법)'
) on conflict (name) do nothing;
