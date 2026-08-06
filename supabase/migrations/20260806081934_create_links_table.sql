create table if not exists public.links (
  slug text primary key,
  destination text not null,
  created_at timestamptz not null default now(),
  expires_at timestamptz not null default (now() + interval '7 days'),
  visits int not null default 0,
  rickrolls int not null default 0
);

-- Lock the table down. All access happens server-side through the
-- service-role key, which bypasses RLS. No anon/authenticated policies
-- are defined, so the table is unreadable/unwritable from the browser.
alter table public.links enable row level security;

-- Atomically record a visit and return the stored row.
-- Returns null (no rows) if the slug doesn't exist or has expired.
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
end;
$$;
