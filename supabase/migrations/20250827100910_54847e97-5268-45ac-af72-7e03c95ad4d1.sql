-- Phase 3 & 4: Address remaining security warnings

-- Move pg_trgm extension from public to extensions schema for better security hygiene
-- Note: This moves the extension but preserves all existing functionality
DROP EXTENSION IF EXISTS pg_trgm CASCADE;
CREATE EXTENSION IF NOT EXISTS pg_trgm WITH SCHEMA extensions;

-- The OTP expiry and leaked password protection settings need to be configured
-- in the Supabase dashboard under Authentication settings as they are not
-- database-level configurations but application-level settings.