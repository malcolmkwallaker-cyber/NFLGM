CREATE TABLE analytics_daily_counts (
  day date PRIMARY KEY,
  event_count integer NOT NULL CHECK (event_count >= 0)
);

INSERT INTO analytics_daily_counts (day, event_count)
SELECT day, COUNT(*)::integer FROM analytics_events GROUP BY day;
