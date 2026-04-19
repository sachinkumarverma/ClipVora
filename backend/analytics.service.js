const { query } = require('./db');

/**
 * Tracks an analytics event in the database.
 * @param {Object} event
 * @param {string} event.eventType - 'info' or 'download'
 * @param {string} event.platform - platform name (e.g., 'youtube', 'instagram')
 * @param {string} event.status - 'success' or 'failure'
 * @param {number} event.responseTime - time taken in ms
 * @param {string} [event.country] - optional country code
 * @param {string} [event.errorType] - reason for failure
 * @param {Object} [event.metadata] - any extra JSON data
 */
const trackEvent = async ({ eventType, platform, status, responseTime, country, errorType, metadata }) => {
  const sql = `
    INSERT INTO analytics_events (event_type, platform, status, response_time, country, error_type, metadata)
    VALUES ($1, $2, $3, $4, $5, $6, $7)
  `;
  const values = [eventType, platform, status, responseTime, country, errorType, metadata ? JSON.stringify(metadata) : null];

  try {
    await query(sql, values);
  } catch (err) {
    console.error('Failed to track analytics event:', err.message);
  }
};

module.exports = { trackEvent };
