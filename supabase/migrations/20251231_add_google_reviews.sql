
-- Disable RLS for this operation if running via SQL Editor, though usually safe.
-- Add google_reviews column to carwash_locations table
ALTER TABLE carwash_locations 
ADD COLUMN IF NOT EXISTS google_reviews JSONB;

COMMENT ON COLUMN carwash_locations.google_reviews IS 'Top reviews fetched from Google Places API';
