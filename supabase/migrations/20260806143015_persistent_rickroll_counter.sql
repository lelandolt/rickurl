-- A single-row table holding lifetime counters that must survive the cron
-- purge of expired links. Summing links.rickrolls was wrong: when the daily
-- cleanup deletes expired rows, their rickrolls would vanish from the total.
create table if not exists public.lifetime_stats (
  id boolean primary key default true,
  rickrolls bigint not null default 0,
  -- Enforce exactly one row.
  constraint lifetime_stats_singleton check (id = true)
);

alter table public.lifetime_stats enable row level security;

-- Seed the single row with the current sum from links so we don't lose the
-- count that already accrued before this counter existed.
insert into public.lifetime_stats (id, rickrolls)
values (true, (select coalesce(sum(rickrolls), 0) from public.links))
on conflict (id) do nothing;

-- record_visit now also bumps the persistent lifetime counter on a rickroll,
-- so the total keeps growing even after the link row is later deleted.
create or replace function public.record_visit(p_slug text, p_rickroll boolean)
returns table(destination text)
language plpgsql
security definer
set search_path to ''
as $function$
begin
  return query
  update public.links
     set visits = visits + 1,
         rickrolls = rickrolls + (case when p_rickroll then 1 else 0 end)
   where slug = p_slug
     and expires_at > now()
  returning links.destination;

  -- Only persist to lifetime stats when the visit actually resolved (a row
  -- was updated) AND it was a rickroll.
  if p_rickroll and found then
    update public.lifetime_stats
       set rickrolls = rickrolls + 1
     where id = true;
  end if;
end;
$function$;

-- Read the lifetime counter from the persistent table instead of summing
-- the (purgeable) links rows.
create or replace function public.total_rickrolls()
returns bigint
language sql
stable
security definer
set search_path to ''
as $$
  select coalesce((select rickrolls from public.lifetime_stats where id = true), 0)::bigint;
$$;
