-- VaultDrive Supabase schema
-- Run this in the Supabase SQL editor before using the app.

create extension if not exists "pgcrypto";

create table if not exists public.files (
  id uuid primary key default gen_random_uuid(),
  file_name text not null,
  file_type text not null,
  folder_name text not null default 'root',
  file_size bigint not null check (file_size >= 0),
  file_url text not null,
  storage_path text not null unique,
  uploaded_at timestamptz not null default now()
);

create table if not exists public.folders (
  id uuid primary key default gen_random_uuid(),
  name text not null unique check (length(trim(name)) > 0),
  created_at timestamptz not null default now()
);

create index if not exists files_uploaded_at_idx on public.files (uploaded_at desc);
create index if not exists files_folder_name_idx on public.files (folder_name);
create index if not exists files_file_name_idx on public.files using gin (to_tsvector('simple', file_name));

insert into storage.buckets (id, name, public)
values ('vault', 'vault', true)
on conflict (id) do update set public = excluded.public;

-- Public buckets only make reads public. Browser uploads still need
-- storage.objects policies when using the anon Supabase client.
drop policy if exists "VaultDrive public read" on storage.objects;
drop policy if exists "VaultDrive public upload" on storage.objects;
drop policy if exists "VaultDrive public update" on storage.objects;
drop policy if exists "VaultDrive public delete" on storage.objects;

create policy "VaultDrive public read"
on storage.objects for select
using (bucket_id = 'vault');

create policy "VaultDrive public upload"
on storage.objects for insert
with check (bucket_id = 'vault');

create policy "VaultDrive public update"
on storage.objects for update
using (bucket_id = 'vault')
with check (bucket_id = 'vault');

create policy "VaultDrive public delete"
on storage.objects for delete
using (bucket_id = 'vault');

alter table public.files disable row level security;
alter table public.folders disable row level security;
