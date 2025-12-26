
-- Create Storage Bucket for Report Images

-- 1. Insert into storage.buckets
insert into storage.buckets (id, name, public)
values ('report-images', 'report-images', true)
on conflict (id) do nothing;

-- 2. Policy: Public Insert
create policy "Allow public uploads"
on storage.objects for insert
with check ( bucket_id = 'report-images' );

-- 3. Policy: Public Read
create policy "Allow public read"
on storage.objects for select
using ( bucket_id = 'report-images' );
