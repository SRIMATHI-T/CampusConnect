const categories = ['General', 'Placement', 'Exam', 'Event', 'Other'];
module.exports = (req, res, next) => {
  const { title, content, category } = req.body || {};
  const errors = {};
  if (typeof title !== 'string' || !title.trim() || title.trim().length > 180) errors.title = 'Title is required (maximum 180 characters).';
  if (typeof content !== 'string' || !content.trim() || content.trim().length > 12000) errors.content = 'Content is required (maximum 12,000 characters).';
  if (!categories.includes(category)) errors.category = 'Choose a valid category.';
  if (Object.keys(errors).length) return res.status(400).json({ success: false, message: 'Please correct the highlighted fields.', errors });
  req.body.title = title.trim(); req.body.content = content.trim();
  next();
};
