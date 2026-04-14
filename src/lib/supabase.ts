import { createClient } from "@supabase/supabase-js";

// 브라우저용 클라이언트 (anon key - 공개 가능) - 지연 초기화
let _supabaseBrowser: ReturnType<typeof createClient> | null = null;
export function getSupabaseBrowser() {
  if (!_supabaseBrowser) {
    _supabaseBrowser = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );
  }
  return _supabaseBrowser;
}

// 서버용 클라이언트 (service role key - 절대 클라이언트에 노출 금지)
export function createServerClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    }
  );
}
