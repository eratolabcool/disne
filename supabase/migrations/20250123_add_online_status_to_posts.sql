-- Add 'online' status to posts table status check constraint
-- This migration modifies the existing check constraint to include 'online' as a valid status

-- First, drop the existing check constraint
ALTER TABLE posts DROP CONSTRAINT IF EXISTS posts_status_check;

-- Add the new check constraint with 'online' included
ALTER TABLE posts ADD CONSTRAINT posts_status_check 
  CHECK (status::text = ANY (ARRAY['draft'::character varying, 'published'::character varying, 'archived'::character varying, 'online'::character varying]::text[]));

-- Add a comment to document the change
COMMENT ON CONSTRAINT posts_status_check ON posts IS 'Allows draft, published, archived, and online status values';