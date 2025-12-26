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
