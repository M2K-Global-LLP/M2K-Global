-- Replaced with a validated identifier by the migration runner. No browser roles
-- receive access; the schema is not one of Supabase's exposed API schemas.
CREATE SCHEMA IF NOT EXISTS __SCHEMA__;
CREATE TABLE IF NOT EXISTS __SCHEMA__.submissions (
  id uuid PRIMARY KEY,
  kind text NOT NULL CHECK (kind IN ('contact', 'application')),
  payload jsonb NOT NULL CHECK (jsonb_typeof(payload) = 'object'),
  resume_key text,
  request_id text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  CHECK ((kind = 'application' AND resume_key IS NOT NULL) OR (kind = 'contact' AND resume_key IS NULL))
);
CREATE TABLE IF NOT EXISTS __SCHEMA__.notifications (
  id uuid PRIMARY KEY,
  submission_id uuid NOT NULL UNIQUE REFERENCES __SCHEMA__.submissions(id) ON DELETE CASCADE,
  status text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'sent')),
  attempts integer NOT NULL DEFAULT 0 CHECK (attempts >= 0),
  retry_at timestamptz,
  sent_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE __SCHEMA__.submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE __SCHEMA__.notifications ENABLE ROW LEVEL SECURITY;
REVOKE ALL ON SCHEMA __SCHEMA__ FROM PUBLIC;
REVOKE ALL ON ALL TABLES IN SCHEMA __SCHEMA__ FROM PUBLIC;
CREATE INDEX IF NOT EXISTS notifications_pending_idx ON __SCHEMA__.notifications (created_at) WHERE status = 'pending';
