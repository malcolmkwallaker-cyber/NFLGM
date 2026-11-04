CREATE TABLE analytics_events (
  id bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  day date NOT NULL,
  session_id text NOT NULL,
  visitor_id text,
  visitor_prev text,
  visitor_d7 text,
  event text NOT NULL,
  path text,
  referrer_host text,
  utm_source text,
  utm_medium text,
  utm_campaign text,
  utm_content text,
  mode text,
  duration_ms integer,
  CONSTRAINT analytics_events_event_check CHECK (
    event IN (
      'pageview',
      'game_start',
      'first_action',
      'season_complete',
      'draft_complete',
      'trade_made',
      'share_card_click',
      'session_end'
    )
  ),
  CONSTRAINT analytics_events_mode_check CHECK (
    mode IS NULL OR mode IN ('Career', 'Season', 'Daily', 'Historical', 'Turnaround')
  ),
  CONSTRAINT analytics_events_duration_check CHECK (
    duration_ms IS NULL OR (duration_ms >= 0 AND duration_ms <= 43200000)
  )
);

CREATE INDEX analytics_events_day_idx ON analytics_events (day);
