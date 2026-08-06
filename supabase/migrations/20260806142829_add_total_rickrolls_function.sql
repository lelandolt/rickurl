-- Aggregates the rickroll counter in Postgres and returns a single bigint,
-- avoiding transferring every row to the app just to sum in Node.
--
-- NOTE: this initial version summed public.links.rickrolls. It is superseded
-- by the persistent_rickroll_counter migration, which reads a dedicated
-- counter table so the total survives the daily purge of expired links.
create or replace function public.total_rickrolls()
returns bigint
language sql
stable
security definer
set search_path = ''
as $$
  select coalesce(sum(rickrolls), 0)::bigint from public.links;
$$;
