-- Convert ageGroup from enum to text to support multi-value JSON storage
ALTER TABLE "Product" ALTER COLUMN "ageGroup" TYPE TEXT;

-- Drop the index on ageGroup (no longer needed as a simple filter)
DROP INDEX IF EXISTS "Product_ageGroup_idx";

-- Drop the old enum type
DROP TYPE IF EXISTS "AgeGroup";
