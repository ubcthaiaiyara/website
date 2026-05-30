-- Schema for the UBC Thai Aiyara membership app.
-- Run this in the Supabase SQL editor (or `supabase db` tooling) to create the
-- members table.

create table if not exists members (
  id            uuid primary key default gen_random_uuid(),
  name          text        not null,
  email         text        not null,
  serial_number text        not null unique,
  auth_token    text        not null,
  created_at    timestamptz not null default now()
);

-- serial_number is looked up on every pass download.
create index if not exists members_serial_number_idx on members (serial_number);

-- FUTURE (do not add yet — these are additive and won't break existing rows or
-- the current insert/select, which name their columns explicitly):
--   alter table members add column payment_status text not null default 'unpaid';
--   alter table members add column tier            text not null default 'standard';
--   alter table members add column google_object_id text; -- Google Wallet object id
