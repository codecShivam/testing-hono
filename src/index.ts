import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { logger } from 'hono/logger';
import { secureHeaders } from 'hono/secure-headers';
import { prettyJSON } from 'hono/pretty-json';
import { config } from './configs/config';
import { apiRoutes } from './api/routes';
import { errorHandler } from './utils/errors';
import { runMigrations } from './db/migrate';

const app = new Hono();

app.use('*', logger()); // middleware to log requests and responses
app.use('*', cors()); // middlelware to handle cors
app.use('*', secureHeaders()); // middleware to add security headers
app.use('*', prettyJSON()); // middleware to format the json response
app.use('*', errorHandler); // middleware to handle errors : how this works? - it will catch all the errors and return a json response with the error message and the status code

app.get('/', (c) => c.json({ status: 'ok', message: 'API is running' }));
app.get('/health', (c) => c.json({ status: 'ok', timestamp: new Date().toISOString() }));

app.route('/api', apiRoutes);

async function startServer() {
  try {
    console.log('🔄 Starting database migration process...');
    await runMigrations();
    console.log(`🚀 Server running on ${config.host}:${config.port}`);
  } catch (error) {
    console.error('❌ Failed to start application:', error);
    process.exit(1);
  }
}

// If this file is executed directly, start the server
if (import.meta.path === Bun.main.toString()) {
  startServer();
}

export default {
  port: config.port,
  fetch: app.fetch,
};