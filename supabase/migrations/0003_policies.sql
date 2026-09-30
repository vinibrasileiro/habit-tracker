-- This app has no authentication by design: it's a private link shared between
-- two people (Vinicius & Camila) with no sensitive data. RLS is enabled (the
-- Supabase-recommended posture for anon-key access) but with a single
-- permissive policy per table, so the anon key can read/write freely.
-- This is intentional, not a gap to "harden" later.

alter table people enable row level security;
alter table habits enable row level security;
alter table checkins enable row level security;
alter table settings enable row level security;

drop policy if exists "public read/write people" on people;
create policy "public read/write people" on people
  for all using (true) with check (true);

drop policy if exists "public read/write habits" on habits;
create policy "public read/write habits" on habits
  for all using (true) with check (true);

drop policy if exists "public read/write checkins" on checkins;
create policy "public read/write checkins" on checkins
  for all using (true) with check (true);

drop policy if exists "public read/write settings" on settings;
create policy "public read/write settings" on settings
  for all using (true) with check (true);

-- Enable realtime delivery for live sync between devices.
alter publication supabase_realtime add table checkins;
