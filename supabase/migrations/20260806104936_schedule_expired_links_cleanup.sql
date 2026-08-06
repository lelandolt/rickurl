-- Enable pg_cron (installs into the "cron" schema).
create extension if not exists pg_cron;

-- Remove any previous version of this job so re-running is idempotent.
select cron.unschedule('delete-expired-links')
where exists (select 1 from cron.job where jobname = 'delete-expired-links');

-- Run every day at 03:00 UTC: permanently delete links that have expired.
-- Expired links already stop resolving (record_visit filters on expires_at),
-- so this is pure housekeeping to keep the table from accumulating dead rows.
select cron.schedule(
  'delete-expired-links',
  '0 3 * * *',
  $$delete from public.links where expires_at < now()$$
);
