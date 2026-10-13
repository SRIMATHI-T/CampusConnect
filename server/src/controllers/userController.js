const User = require('../models/User');
exports.list = async (_req, res) => {
  const users = await User.find().sort({ createdAt: -1 }).select('name email role createdAt').lean();
  res.json({ success: true, users: users.map(u => ({ id: u._id, name: u.name, email: u.email, role: u.role === 'user' ? 'student' : u.role, createdAt: u.createdAt })) });
};
exports.updateProfile = async (req, res) => {
  const name = typeof req.body.name === 'string' ? req.body.name.trim() : '';
  if (name.length < 2 || name.length > 100) return res.status(400).json({ success: false, message: 'Name must contain 2–100 characters.' });
  const user = await User.findByIdAndUpdate(req.user.id, { name }, { new: true, runValidators: true });
  res.json({ success: true, user: user.toSafeJSON() });
};
