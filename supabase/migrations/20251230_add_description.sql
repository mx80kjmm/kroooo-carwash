-- Add description column for AI-generated content
ALTER TABLE carwash_locations ADD COLUMN IF NOT EXISTS description text;
