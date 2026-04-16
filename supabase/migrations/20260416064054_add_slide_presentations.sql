-- slide_presentations 테이블
create table if not exists slide_presentations (
  id          uuid primary key default gen_random_uuid(),
  proposal_id uuid references proposals(id) on delete cascade,
  slides_json jsonb not null,
  created_at  timestamptz default now()
);

create index if not exists slide_presentations_proposal_id_idx on slide_presentations(proposal_id);

-- RLS 비활성화 (회원가입 없는 공개 앱)
alter table slide_presentations disable row level security;
