-- Source: 20251227_add_filter_columns.sql
-- 新しいフィルター用カラムを追加
ALTER TABLE carwash_locations 
ADD COLUMN IF NOT EXISTS is_24h boolean DEFAULT false,
ADD COLUMN IF NOT EXISTS has_unlimited_water boolean DEFAULT false;

-- 既存データの更新（business_hoursに「24時間」が含まれていたら is_24h = true にする）
UPDATE carwash_locations 
SET is_24h = true 
WHERE business_hours ILIKE '%24時間%' 
   OR business_hours ILIKE '%24h%'
   OR business_hours ILIKE '%終日%';

COMMENT ON COLUMN carwash_locations.is_24h IS '24時間営業かどうか';
COMMENT ON COLUMN carwash_locations.has_unlimited_water IS '水道使い放題かどうか';


-- Source: 20251227_storage_bucket.sql

-- Create Storage Bucket for Report Images

-- 1. Insert into storage.buckets
insert into storage.buckets (id, name, public)
values ('report-images', 'report-images', true)
on conflict (id) do nothing;

-- 2. Policy: Public Insert (既存の場合は削除してから作成)
drop policy if exists "Allow public uploads" on storage.objects;
create policy "Allow public uploads"
on storage.objects for insert
with check ( bucket_id = 'report-images' );

-- 3. Policy: Public Read (既存の場合は削除してから作成)
drop policy if exists "Allow public read" on storage.objects;
create policy "Allow public read"
on storage.objects for select
using ( bucket_id = 'report-images' );


-- Source: 20251227_user_reporting.sql

-- Migration: User Reporting System (Fixed)

-- 1. Add is_active column to carwash_locations for logical deletion
alter table carwash_locations add column if not exists is_active boolean default true;

-- 2. Create Enums
-- Check if exists first to avoid error on re-run
do $$ begin
    create type report_type as enum ('new_location', 'correction', 'closure');
exception
    when duplicate_object then null;
end $$;

do $$ begin
    create type report_status as enum ('pending', 'approved', 'rejected');
exception
    when duplicate_object then null;
end $$;

-- 3. Create location_reports table
create table if not exists location_reports (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz default now(),
  updated_at timestamptz default now(),
  
  -- Link to existing location (null for new spots)
  -- Changed to UUID to match carwash_locations.id
  location_id uuid references carwash_locations(id),
  
  -- Reporter info (optional, nullable for anonymous)
  user_id uuid references auth.users(id),
  user_contact_info text, 
  
  -- Report content
  type report_type not null,
  status report_status not null default 'pending',
  
  -- Proposed changes in JSON
  proposed_data jsonb,
  
  -- User comment
  comment text,
  
  -- Admin notes
  admin_notes text
);

-- 4. Enable RLS
alter table location_reports enable row level security;

-- 5. Policies
-- Drop existing policies if re-running
drop policy if exists "Allow public insert reports" on location_reports;
drop policy if exists "Allow authenticated read reports" on location_reports;
drop policy if exists "Allow authenticated update reports" on location_reports;

create policy "Allow public insert reports" 
on location_reports for insert 
with check (true);

create policy "Allow authenticated read reports"
on location_reports for select
using (auth.role() = 'authenticated' or auth.role() = 'service_role');

create policy "Allow authenticated update reports"
on location_reports for update
using (auth.role() = 'authenticated' or auth.role() = 'service_role');


