-- Add is_public column to lofi_beats table if it doesn't exist
ALTER TABLE lofi_beats ADD COLUMN IF NOT EXISTS is_public BOOLEAN DEFAULT true;

-- Update existing records to be public by default
UPDATE lofi_beats SET is_public = true WHERE is_public IS NULL;
