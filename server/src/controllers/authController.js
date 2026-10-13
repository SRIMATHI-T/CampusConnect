const jwt = require('jsonwebtoken');
const User = require('../models/User');

function signToken(user) {
  if (!process.env.JWT_SECRET || (process.env.NODE_ENV === 'production' && process.env.JWT_SECRET.length < 32)) {
    throw new Error('JWT_SECRET must be set (and at least 32 characters in production).');
  }
  return jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '24h', issuer: 'campusconnect' });
}
exports.signup = async (req, res) => {
  const { name, email, password } = req.body;
  const existing = await User.findOne({ email });
  if (existing) return res.status(409).json({ success: false, message: 'An account with this email already exists.' });
  // Public signup always creates a student. Never trust a role sent by the browser.
  const user = await User.create({ name, email, password, role: 'student' });
  const token = signToken(user);
  res.status(201).json({ success: true, message: 'Account created successfully.', token, user: user.toSafeJSON() });
};
exports.login = async (req, res) => {
  const user = await User.findOne({ email: req.body.email }).select('+password');
  if (!user || !(await user.comparePassword(req.body.password))) {
    return res.status(401).json({ success: false, message: 'Invalid email or password.' });
  }
  res.json({ success: true, message: 'Login successful.', token: signToken(user), user: user.toSafeJSON() });
};
exports.me = async (req, res) => {
  const user = await User.findById(req.user.id);
  if (!user) return res.status(404).json({ success: false, message: 'User not found.' });
  res.json({ success: true, user: user.toSafeJSON() });
};
