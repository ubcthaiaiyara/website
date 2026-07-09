-- Schema for the UBC Thai Aiyara membership app.
-- Run this in the Supabase SQL editor (or `supabase db` tooling) to create the
-- members table.

create table if not exists members (
  id            uuid primary key default gen_random_uuid(),
  name          text        not null,
  email         text        not null unique,
  user_id       uuid        unique references auth.users(id) on delete cascade,
  serial_number text        not null unique,
  auth_token    text        not null,
  password_hash text,
  created_at    timestamptz not null default now(),
  -- Editable personal details (set from the member's account page).
  faculty       text,
  program       text,
  year          text
);

-- serial_number is looked up on every pass download.
create index if not exists members_serial_number_idx on members (serial_number);

-- user_id is looked up for every signed-in request (the unique constraint above
-- also creates an index). email remains unique for legacy row linking.

-- MIGRATION for an ALREADY-DEPLOYED table (the `create table if not exists`
-- above is a no-op once the table exists, so run these to add member login).
-- Idempotent and safe on existing rows: password_hash is added nullable here
-- (new signups always set it; pre-existing rows simply cannot log in until they
-- re-register). The unique email index enables login-by-email.
--   alter table members add column if not exists password_hash text;
--   create unique index if not exists members_email_key on members (lower(email));

-- MIGRATION for Supabase Auth: link app-specific member rows to auth.users.
-- Existing rows are left nullable and linked on the user's next successful auth.
--   alter table members add column if not exists user_id uuid references auth.users(id) on delete cascade;
--   create unique index if not exists members_user_id_key on members (user_id);
--   alter table members alter column password_hash drop not null;

-- MIGRATION for an ALREADY-DEPLOYED table: add the editable profile columns.
-- Nullable so existing rows are unaffected; the account page writes them.
--   alter table members add column if not exists faculty text;
--   alter table members add column if not exists program text;
--   alter table members add column if not exists year    text;

-- FUTURE (do not add yet — these are additive and won't break existing rows or
-- the current insert/select, which name their columns explicitly):
--   alter table members add column payment_status text not null default 'unpaid';
--   alter table members add column tier            text not null default 'standard';
--   alter table members add column google_object_id text; -- Google Wallet object id
