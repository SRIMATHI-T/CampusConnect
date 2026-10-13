const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../../.env') });
require('dotenv').config();
const mongoose = require('mongoose');
const User = require('../src/models/User');

async function main() {
  const { MONGODB_URI, ADMIN_NAME, ADMIN_EMAIL, ADMIN_PASSWORD } = process.env;
  if (!MONGODB_URI || !ADMIN_NAME || !ADMIN_EMAIL || !ADMIN_PASSWORD) {
    throw new Error('Set MONGODB_URI, ADMIN_NAME, ADMIN_EMAIL, and ADMIN_PASSWORD in the server environment before running this script.');
  }
  if (ADMIN_PASSWORD.length < 12) throw new Error('ADMIN_PASSWORD must be at least 12 characters.');
  await mongoose.connect(MONGODB_URI, { dbName: 'CampusConnect' });
  const email = ADMIN_EMAIL.trim().toLowerCase();
  let user = await User.findOne({ email }).select('+password');
  if (user) {
    user.name = ADMIN_NAME.trim();
    user.role = 'admin';
    user.password = ADMIN_PASSWORD;
    await user.save();
    console.log(`Administrator role/password updated for ${email}`);
  } else {
    user = await User.create({ name: ADMIN_NAME.trim(), email, password: ADMIN_PASSWORD, role: 'admin' });
    console.log(`Administrator created: ${email}`);
  }
  await mongoose.disconnect();
}
main().catch(async err => { console.error(err.message); try { await mongoose.disconnect(); } catch {} process.exit(1); });
