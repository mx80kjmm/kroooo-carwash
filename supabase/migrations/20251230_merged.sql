-- Source: 20251230_add_description.sql
-- Add description column for AI-generated content
ALTER TABLE carwash_locations ADD COLUMN IF NOT EXISTS description text;


-- Source: 20251230_add_google_places.sql
-- Add Google Places related columns
ALTER TABLE carwash_locations ADD COLUMN IF NOT EXISTS google_place_id text;
ALTER TABLE carwash_locations ADD COLUMN IF NOT EXISTS google_rating numeric(2, 1); -- e.g. 4.5
ALTER TABLE carwash_locations ADD COLUMN IF NOT EXISTS google_user_ratings_total integer;


