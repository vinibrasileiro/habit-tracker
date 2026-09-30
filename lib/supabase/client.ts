import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error(
    "Missing NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_ANON_KEY. Copy .env.local.example to .env.local and fill in your Supabase project credentials."
  );
}

// Not parameterized with a Database generic: the installed postgrest-js
// version's GenericSchema conformance check doesn't accept a hand-written
// Database type shaped like `supabase gen types typescript` output (verified
// in isolation — every table/view/function variant falls back to `never`
// results instead of `any`). Call sites cast query results to the Row types
// in ./types instead, which is just as safe for our 4 fixed tables.
export const supabase = createClient(supabaseUrl, supabaseAnonKey);
