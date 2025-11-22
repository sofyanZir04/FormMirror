-- Create form_interactions table (renamed from analytics_events)
CREATE TABLE IF NOT EXISTS form_interactions (
  id BIGSERIAL PRIMARY KEY,
  project_id TEXT NOT NULL,
  session_id TEXT NOT NULL,
  event_type TEXT NOT NULL,
  field_name TEXT,
  duration INTEGER,
  event_timestamp TIMESTAMPTZ NOT NULL,
  page_url TEXT,
  user_agent TEXT,
  ip_address TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create user_sessions table (renamed from analytics_sessions)
CREATE TABLE IF NOT EXISTS user_sessions (
  id BIGSERIAL PRIMARY KEY,
  project_id TEXT NOT NULL,
  session_id TEXT UNIQUE NOT NULL,
  first_seen TIMESTAMPTZ DEFAULT NOW(),
  last_active TIMESTAMPTZ DEFAULT NOW(),
  total_events INTEGER DEFAULT 0,
  user_agent TEXT,
  ip_address TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_fi_project ON form_interactions(project_id);
CREATE INDEX IF NOT EXISTS idx_fi_session ON form_interactions(session_id);
CREATE INDEX IF NOT EXISTS idx_fi_timestamp ON form_interactions(event_timestamp);
CREATE INDEX IF NOT EXISTS idx_fi_type ON form_interactions(event_type);
CREATE INDEX IF NOT EXISTS idx_us_project ON user_sessions(project_id);
CREATE INDEX IF NOT EXISTS idx_us_session ON user_sessions(session_id);

-- Enable RLS
ALTER TABLE form_interactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_sessions ENABLE ROW LEVEL SECURITY;

-- Policies for service role
CREATE POLICY "service_insert_interactions" ON form_interactions
  FOR INSERT TO service_role WITH CHECK (true);

CREATE POLICY "service_insert_sessions" ON user_sessions
  FOR INSERT TO service_role WITH CHECK (true);

CREATE POLICY "service_update_sessions" ON user_sessions
  FOR UPDATE TO service_role USING (true);

-- View for querying data
CREATE OR REPLACE VIEW interaction_summary AS
SELECT 
  project_id,
  DATE(event_timestamp) as date,
  event_type,
  COUNT(*) as count,
  COUNT(DISTINCT session_id) as sessions,
  AVG(CASE WHEN duration > 0 THEN duration ELSE NULL END) as avg_duration
FROM form_interactions
GROUP BY project_id, DATE(event_timestamp), event_type
ORDER BY date DESC;