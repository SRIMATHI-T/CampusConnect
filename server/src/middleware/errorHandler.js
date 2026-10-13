module.exports = (err, _req, res, _next) => {
  if (err.code === 11000) return res.status(409).json({ success: false, message: 'An account with that email already exists.' });
  if (err.name === 'ValidationError' || err.name === 'CastError') {
    return res.status(400).json({ success: false, message: 'Please check the submitted data.' });
  }
  if (err instanceof SyntaxError && 'body' in err) return res.status(400).json({ success: false, message: 'Invalid JSON request.' });
  const status = err.status || 500;
  if (status >= 500) console.error(err);
  res.status(status).json({ success: false, message: status >= 500 ? 'An unexpected server error occurred.' : err.message });
};
