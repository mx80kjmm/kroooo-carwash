-- Rename and Modify Columns
-- Note: "has_self_wash" -> "has_manual_spray_wash"
ALTER TABLE carwash_locations RENAME COLUMN has_self_wash TO has_manual_spray_wash;

-- Note: "has_auto_wash" -> "has_gantry_wash"
ALTER TABLE carwash_locations RENAME COLUMN has_auto_wash TO has_gantry_wash;

-- Remove "has_mat_wash"
ALTER TABLE carwash_locations DROP COLUMN IF EXISTS has_mat_wash;

-- Modify existing BOOLEAN columns to be nullable (if not already) to support 3-state logic
-- ALTER TABLE carwash_locations ALTER COLUMN has_manual_spray_wash DROP NOT NULL; -- usually already nullable or default false? Check first.
-- Assuming we want to allow NULL.

-- Remove "has_unlimited_water" (will replace with new structure)
ALTER TABLE carwash_locations DROP COLUMN IF EXISTS has_unlimited_water;

-- Add new Water Sink columns
ALTER TABLE carwash_locations ADD COLUMN IF NOT EXISTS water_sink_status TEXT CHECK (water_sink_status IN ('none', 'unconfirmed', 'cold', 'hot')) DEFAULT 'unconfirmed';
ALTER TABLE carwash_locations ADD COLUMN IF NOT EXISTS water_sink_fee_type TEXT CHECK (water_sink_fee_type IN ('unconfirmed', 'free', 'paid')) DEFAULT 'unconfirmed';
ALTER TABLE carwash_locations ADD COLUMN IF NOT EXISTS water_sink_fee_info TEXT;

-- Add other new columns
ALTER TABLE carwash_locations ADD COLUMN IF NOT EXISTS has_supplies_vending BOOLEAN; -- 3-state
ALTER TABLE carwash_locations ADD COLUMN IF NOT EXISTS has_staff BOOLEAN; -- 3-state
ALTER TABLE carwash_locations ADD COLUMN IF NOT EXISTS has_pure_water BOOLEAN; -- 3-state
