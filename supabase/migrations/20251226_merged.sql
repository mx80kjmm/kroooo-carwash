-- Source: 20251226_add_missing_columns.sql

-- Add missing columns to carwash_locations table
-- Based on requirements from src/types/carwash.ts

-- 1. Boolean flags for equipment
ALTER TABLE carwash_locations ADD COLUMN IF NOT EXISTS has_non_brush boolean DEFAULT false;
ALTER TABLE carwash_locations ADD COLUMN IF NOT EXISTS has_self_wash boolean DEFAULT false;
ALTER TABLE carwash_locations ADD COLUMN IF NOT EXISTS has_auto_wash boolean DEFAULT false;
ALTER TABLE carwash_locations ADD COLUMN IF NOT EXISTS has_vacuum boolean DEFAULT false;
ALTER TABLE carwash_locations ADD COLUMN IF NOT EXISTS has_mat_wash boolean DEFAULT false;

-- 2. Additional text fields
ALTER TABLE carwash_locations ADD COLUMN IF NOT EXISTS url text;
ALTER TABLE carwash_locations ADD COLUMN IF NOT EXISTS notes text;
ALTER TABLE carwash_locations ADD COLUMN IF NOT EXISTS price_range text;

-- 3. Rename opening_hours to business_hours (to match Type definition)
-- Check if opening_hours exists before renaming to avoid errors if already renamed
DO $$
BEGIN
  IF EXISTS(SELECT *
    FROM information_schema.columns
    WHERE table_name = 'carwash_locations' AND column_name = 'opening_hours')
  THEN
      ALTER TABLE carwash_locations RENAME COLUMN opening_hours TO business_hours;
  END IF;
END $$;


-- Source: 20251226_add_x_post_url.sql
-- Add x_post_url column to carwash_locations table
ALTER TABLE carwash_locations ADD COLUMN IF NOT EXISTS x_post_url text;


-- Source: 20251226_consolidated.sql

-- Consolidated Migration 2025-12-26
-- 1. Add missing equipment flags
ALTER TABLE carwash_locations ADD COLUMN IF NOT EXISTS has_non_brush boolean DEFAULT false;
ALTER TABLE carwash_locations ADD COLUMN IF NOT EXISTS has_self_wash boolean DEFAULT false;
ALTER TABLE carwash_locations ADD COLUMN IF NOT EXISTS has_auto_wash boolean DEFAULT false;
ALTER TABLE carwash_locations ADD COLUMN IF NOT EXISTS has_vacuum boolean DEFAULT false;
ALTER TABLE carwash_locations ADD COLUMN IF NOT EXISTS has_mat_wash boolean DEFAULT false;

-- 2. Add URLs and Notes
ALTER TABLE carwash_locations ADD COLUMN IF NOT EXISTS url text;
ALTER TABLE carwash_locations ADD COLUMN IF NOT EXISTS notes text;
ALTER TABLE carwash_locations ADD COLUMN IF NOT EXISTS price_range text;
ALTER TABLE carwash_locations ADD COLUMN IF NOT EXISTS x_post_url text;

-- 3. Rename opening_hours to business_hours (Safe Check)
DO $$
BEGIN
  IF EXISTS(SELECT *
    FROM information_schema.columns
    WHERE table_name = 'carwash_locations' AND column_name = 'opening_hours')
  THEN
      ALTER TABLE carwash_locations RENAME COLUMN opening_hours TO business_hours;
  END IF;
END $$;


