-- ============================================================
-- AssetTrack — Supabase Database Setup
-- Run this in: supabase.com → your project → SQL Editor
-- ============================================================

-- 1. Create the assets table
create table if not exists public.assets (
  id             text primary key,
  company_number text,
  name           text,
  brand          text,
  model          text,
  serial         text,
  type           text,
  department     text,
  location       text,
  status         text default 'Active',
  assigned_to    text,
  purchase_date  text,
  notes          text,
  created_at     timestamp with time zone default now(),
  updated_at     timestamp with time zone default now()
);

-- 2. Auto-update updated_at on every change
create or replace function update_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger assets_updated_at
  before update on public.assets
  for each row execute function update_updated_at();

-- 3. Row Level Security — only authenticated users can access data
alter table public.assets enable row level security;

create policy "Authenticated users can read assets"
  on public.assets for select
  to authenticated
  using (true);

create policy "Authenticated users can insert assets"
  on public.assets for insert
  to authenticated
  with check (true);

create policy "Authenticated users can update assets"
  on public.assets for update
  to authenticated
  using (true);

create policy "Authenticated users can delete assets"
  on public.assets for delete
  to authenticated
  using (true);

-- ============================================================
-- Done! Now go to Authentication → Users and create your
-- team's accounts (email + password).
-- ============================================================
