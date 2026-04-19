const { query } = require('./db');

const initDb = async () => {
  const createTableQuery = `
    CREATE TABLE IF NOT EXISTS analytics_events (
      id SERIAL PRIMARY KEY,
      event_type VARCHAR(50) NOT NULL,
      platform VARCHAR(50),
      status VARCHAR(20) NOT NULL,
      response_time INTEGER,
      country VARCHAR(10),
      error_type TEXT,
      metadata JSONB,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );

    CREATE INDEX IF NOT EXISTS idx_analytics_created_at ON analytics_events(created_at);
    CREATE INDEX IF NOT EXISTS idx_analytics_platform ON analytics_events(platform);
    CREATE INDEX IF NOT EXISTS idx_analytics_status ON analytics_events(status);
    CREATE INDEX IF NOT EXISTS idx_analytics_country ON analytics_events(country);
  `;

  try {
    console.log('Initializing database...');
    await query(createTableQuery);
    console.log('Database initialized successfully.');
    process.exit(0);
  } catch (err) {
    console.error('Error initializing database:', err);
    process.exit(1);
  }
};

initDb();
