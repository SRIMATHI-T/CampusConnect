const express = require('express');
const cors = require('cors');
const path = require('path');
const authRoutes = require('./routes/authRoutes');
const noticeRoutes = require('./routes/noticeRoutes');
const userRoutes = require('./routes/userRoutes');
const errorHandler = require('./middleware/errorHandler');

const app = express();
const allowedOrigins = (process.env.CLIENT_URL || 'http://localhost:3000,http://localhost:5173')
  .split(',')
  .map(v => v.trim())
  .filter(Boolean);

app.disable('x-powered-by');
app.use(cors({
  origin(origin, cb) {
    if (
      !origin ||
      allowedOrigins.includes(origin) ||
      (process.env.NODE_ENV !== 'production' && /^https?:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/.test(origin))
    ) {
      return cb(null, true);
    }
    const corsError = new Error('Origin is not allowed by CORS.');
    corsError.status = 403;
    return cb(corsError);
  },
  credentials: true
}));
app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: true, limit: '1mb' }));
app.get('/api/health', (_req, res) => res.json({ success: true, status: 'ok' }));
app.use('/uploads', express.static(path.resolve(process.env.UPLOAD_DIR || 'uploads'), { fallthrough: false }));
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/notices', noticeRoutes);
app.use('/api/v1/users', userRoutes);
// Compatibility aliases for the old API URL prefixes; no legacy HTML/static app is retained.
app.use('/api/auth', authRoutes);
app.use('/api/notices', noticeRoutes);
app.use((_req, res) => res.status(404).json({ success: false, message: 'API endpoint not found.' }));
app.use(errorHandler);
module.exports = app;
