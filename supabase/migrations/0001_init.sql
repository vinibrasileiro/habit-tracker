-- Core schema for the 30-day bullet journal habit tracker.

create extension if not exists "pgcrypto";

create table if not exists people (
  id text primary key,
  display_name text not null,
  emoji text not null default '👤',
  sort_order int not null
);

create table if not exists habits (
  id text primary key,
  label text not null,
  icon text not null,
  person_id text not null references people(id),
  sort_order int not null,
  failed_glyph text not null default '✕'
);

do $$
begin
  if not exists (select 1 from pg_type where typname = 'checkin_status') then
    create type checkin_status as enum ('unset', 'done', 'failed');
  end if;
end
$$;

create table if not exists checkins (
  id uuid primary key default gen_random_uuid(),
  person_id text not null references people(id),
  habit_id text not null references habits(id),
  checkin_date date not null,
  status checkin_status not null default 'unset',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (person_id, habit_id, checkin_date)
);

create or replace function set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

drop trigger if exists checkins_set_updated_at on checkins;
create trigger checkins_set_updated_at
  before update on checkins
  for each row
  execute function set_updated_at();

create table if not exists settings (
  id int primary key default 1 check (id = 1),
  challenge_start_date date not null,
  challenge_duration_days int not null default 30
);
