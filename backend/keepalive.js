require('dotenv').config();
const { pool } = require('./db');

async function keepAlive() {
  console.log('--- Starting Supabase Keep-Alive Ping ---');
  if (!process.env.DATABASE_URL) {
    console.error('❌ ERROR: DATABASE_URL environment variable is missing.');
    process.exit(1);
  }

  try {
    // 1. Direct PostgreSQL query to guarantee actual DB activity on Postgres instance
    const dbResult = await pool.query(`
      SELECT 
        NOW() AS server_time,
        (SELECT COUNT(*) FROM analytics_events) AS total_analytics_events
    `);
    
    console.log('✅ PostgreSQL Connection & Query Successful!');
    console.log('Server Time:', dbResult.rows[0].server_time);
    console.log('Total Analytics Events in DB:', dbResult.rows[0].total_analytics_events);

    // 2. Insert a lightweight keepalive event into analytics_events table
    await pool.query(`
      INSERT INTO analytics_events (event_type, platform, status, response_time, user_agent)
      VALUES ($1, $2, $3, $4, $5)
    `, ['keepalive_ping', 'system', 'success', 0, 'keepalive_script']);
    
    console.log('✅ Keep-Alive Event Inserted into analytics_events table.');

    // 3. Clean up old keepalive entries (keep last 30 days of keepalive logs)
    const deleteResult = await pool.query(`
      DELETE FROM analytics_events 
      WHERE event_type = 'keepalive_ping' 
        AND created_at < NOW() - INTERVAL '30 days'
    `);
    console.log(`✅ Cleanup completed (${deleteResult.rowCount} old records removed).`);

    console.log('🎉 Supabase database activity registered successfully!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Supabase Keep-Alive Failed:', error.message);
    process.exit(1);
  } finally {
    try {
      await pool.end();
    } catch (_) {}
  }
}

keepAlive();
