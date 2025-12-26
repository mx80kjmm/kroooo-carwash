-- Add x_post_url column to carwash_locations table
ALTER TABLE carwash_locations ADD COLUMN IF NOT EXISTS x_post_url text;
