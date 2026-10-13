const jwt = require('jsonwebtoken');
const User = require('../models/User');

module.exports = async function authMiddleware(req, res, next) {
  try {
    const auth = req.headers.authorization || '';
    const token = auth.startsWith('Bearer ') ? auth.slice(7) : req.headers['x-auth-token'];
    if (!token) return res.status(401).json({ success: false, message: 'Authentication required.' });
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.userId);
    if (!user) return res.status(401).json({ success: false, message: 'Account no longer exists.' });
    req.user = { id: String(user._id), email: user.email, name: user.name, role: user.role === 'user' ? 'student' : user.role };
    next();
  } catch {
    return res.status(401).json({ success: false, message: 'Session is invalid or expired. Please log in again.' });
  }
};
