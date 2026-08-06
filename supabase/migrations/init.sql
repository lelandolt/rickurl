-- RickURL database schema.
-- Single consolidated file representing the final desired state. Run this
-- against a fresh Supabase project to reproduce everything: tables, the
-- visit-recording logic, the lifetime rickroll counter, and the daily
-- cleanup job.

-- ---------------------------------------------------------------------------
-- Tables
-- ---------------------------------------------------------------------------

-- Every shortened link. Links live for 7 days, then get purged by the cron
-- job below (they already stop resolving at expires_at regardless).
create table if not exists public.links (
  slug        text primary key,
  destination text not null,
  created_at  timestamptz not null default now(),
  expires_at  timestamptz not null default (now() + interval '7 days'),
  visits      int not null default 0,
  rickrolls   int not null default 0
);

-- Single-row table of lifetime counters. This is deliberately separate from
-- `links` so the total survives the daily purge of expired rows — summing
-- links.rickrolls would shrink the total every time a link is deleted.
create table if not exists public.lifetime_stats (
  id        boolean primary key default true,
  rickrolls bigint not null default 0,
  constraint lifetime_stats_singleton check (id = true) -- enforce exactly one row
);

-- Seed the single stats row.
insert into public.lifetime_stats (id, rickrolls)
values (true, 0)
on conflict (id) do nothing;

-- ---------------------------------------------------------------------------
-- Row Level Security
-- ---------------------------------------------------------------------------
-- All access happens server-side through the service-role key, which bypasses
-- RLS. No anon/authenticated policies are defined, so both tables are
-- unreadable/unwritable from the browser.

alter table public.links          enable row level security;
alter table public.lifetime_stats enable row level security;

-- ---------------------------------------------------------------------------
-- Functions
-- ---------------------------------------------------------------------------

-- Atomically record a visit and return the destination. Returns no rows if the
-- slug doesn't exist or has expired. On a resolved rickroll it also bumps the
-- persistent lifetime counter, so that total keeps growing after links expire.
create or replace function public.record_visit(p_slug text, p_rickroll boolean)
returns table (destination text)
language plpgsql
security definer
set search_path = ''
as $$
begin
  return query
  update public.links
     set visits = visits + 1,
         rickrolls = rickrolls + (case when p_rickroll then 1 else 0 end)
   where slug = p_slug
     and expires_at > now()
  returning links.destination;

  if p_rickroll and found then
    update public.lifetime_stats
       set rickrolls = rickrolls + 1
     where id = true;
  end if;
end;
$$;

-- Lifetime rickroll count for the homepage footer. Reads the persistent
-- single-row counter (not a scan/sum of links), so it's cheap and immune to
-- the expired-link cleanup.
create or replace function public.total_rickrolls()
returns bigint
language sql
stable
security definer
set search_path = ''
as $$
  select coalesce((select rickrolls from public.lifetime_stats where id = true), 0)::bigint;
$$;

-- ---------------------------------------------------------------------------
-- Scheduled cleanup (pg_cron)
-- ---------------------------------------------------------------------------

create extension if not exists pg_cron;

-- Idempotent: drop any previous version of the job before (re)scheduling.
select cron.unschedule('delete-expired-links')
where exists (select 1 from cron.job where jobname = 'delete-expired-links');

-- Daily at 03:00 UTC, permanently delete expired links (pure housekeeping).
select cron.schedule(
  'delete-expired-links',
  '0 3 * * *',
  $$delete from public.links where expires_at < now()$$
);
