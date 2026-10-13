const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
function validateSignup(req, res, next) {
  const { name, email, password } = req.body || {};
  const errors = {};
  if (typeof name !== 'string' || name.trim().length < 2 || name.trim().length > 100) errors.name = 'Enter a name between 2 and 100 characters.';
  if (typeof email !== 'string' || !emailPattern.test(email.trim())) errors.email = 'Enter a valid email address.';
  if (typeof password !== 'string' || password.length < 8 || password.length > 128) errors.password = 'Password must contain 8–128 characters.';
  if (Object.keys(errors).length) return res.status(400).json({ success: false, message: 'Please correct the highlighted fields.', errors });
  req.body.name = name.trim(); req.body.email = email.trim().toLowerCase();
  next();
}
function validateLogin(req, res, next) {
  const { email, password } = req.body || {};
  if (typeof email !== 'string' || !emailPattern.test(email.trim()) || typeof password !== 'string' || !password.length) {
    return res.status(400).json({ success: false, message: 'Enter a valid email and password.' });
  }
  req.body.email = email.trim().toLowerCase();
  next();
}
module.exports = { validateSignup, validateLogin };
