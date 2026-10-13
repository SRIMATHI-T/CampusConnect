const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../../.env') });
require('dotenv').config();
const app = require('./app');
const connectDatabase = require('./config/db');

const port = Number(process.env.PORT) || 5000;
async function start() {
  try {
    if (!process.env.JWT_SECRET || (process.env.NODE_ENV === 'production' && process.env.JWT_SECRET.length < 32)) {
      throw new Error('JWT_SECRET must be set (and at least 32 characters in production).');
    }
    await connectDatabase();
    app.listen(port, () => console.log(`CampusConnect API listening on port ${port}`));
  } catch (error) {
    console.error('Startup failed:', error.message);
    process.exit(1);
  }
}
start();
