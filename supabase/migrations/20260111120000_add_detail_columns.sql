-- Add detailed columns
ALTER TABLE carwash_locations ADD COLUMN IF NOT EXISTS has_subscription BOOLEAN;
ALTER TABLE carwash_locations ADD COLUMN IF NOT EXISTS wash_course_info TEXT;
ALTER TABLE carwash_locations ADD COLUMN IF NOT EXISTS max_vehicle_size TEXT;
