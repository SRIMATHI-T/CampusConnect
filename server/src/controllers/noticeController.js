const fs = require('fs');
const path = require('path');
const Notice = require('../models/Notice');

exports.list = async (req, res) => {
  const filter = { archived: req.query.archived === 'true' };
  if (req.query.category && req.query.category !== 'All') filter.category = req.query.category;
  if (req.query.search) filter.$text = { $search: String(req.query.search).slice(0, 100) };
  const page = Math.max(1, Number.parseInt(req.query.page, 10) || 1);
  const limit = Math.min(50, Math.max(1, Number.parseInt(req.query.limit, 10) || 20));
  const [items, total] = await Promise.all([
    Notice.find(filter).sort({ date: -1 }).skip((page - 1) * limit).limit(limit).lean(),
    Notice.countDocuments(filter)
  ]);
  res.json({ success: true, items, pagination: { page, limit, total, pages: Math.ceil(total / limit) } });
};
exports.publicList = async (_req, res) => {
  const items = await Notice.find({ archived: false }).sort({ date: -1 }).limit(6).select('title content category postedBy date imageUrl').lean();
  res.json({ success: true, items });
};
exports.getOne = async (req, res) => {
  const item = await Notice.findById(req.params.id);
  if (!item) return res.status(404).json({ success: false, message: 'Notice not found.' });
  res.json({ success: true, item });
};
exports.create = async (req, res) => {
  const item = await Notice.create({
    title: req.body.title, content: req.body.content, category: req.body.category,
    postedBy: req.user.name, postedById: req.user.id,
    imageUrl: req.file ? `/uploads/${req.file.filename}` : null
  });
  res.status(201).json({ success: true, item, message: 'Notice created.' });
};
exports.update = async (req, res) => {
  const item = await Notice.findById(req.params.id);
  if (!item) return res.status(404).json({ success: false, message: 'Notice not found.' });
  item.title = req.body.title; item.content = req.body.content; item.category = req.body.category;
  if (req.file) {
    removeUpload(item.imageUrl);
    item.imageUrl = `/uploads/${req.file.filename}`;
  }
  await item.save();
  res.json({ success: true, item, message: 'Notice updated.' });
};
function removeUpload(url) {
  if (!url || !url.startsWith('/uploads/')) return;
  const base = path.resolve(process.env.UPLOAD_DIR || 'uploads');
  const file = path.resolve(base, path.basename(url));
  if (file.startsWith(base + path.sep)) fs.promises.unlink(file).catch(() => {});
}
exports.remove = async (req, res) => {
  const item = await Notice.findById(req.params.id);
  if (!item) return res.status(404).json({ success: false, message: 'Notice not found.' });
  removeUpload(item.imageUrl);
  await item.deleteOne();
  res.json({ success: true, message: 'Notice deleted.' });
};
exports.archive = async (req, res) => {
  const item = await Notice.findById(req.params.id);
  if (!item) return res.status(404).json({ success: false, message: 'Notice not found.' });
  item.archived = req.body.archived === true;
  item.archivedDate = item.archived ? new Date() : null;
  await item.save();
  res.json({ success: true, item, message: item.archived ? 'Notice archived.' : 'Notice restored.' });
};
exports.stats = async (_req, res) => {
  const today = new Date(); today.setHours(0,0,0,0);
  const [total, archived, todayCount, byCategory] = await Promise.all([
    Notice.countDocuments(), Notice.countDocuments({ archived: true }),
    Notice.countDocuments({ date: { $gte: today } }),
    Notice.aggregate([{ $group: { _id: '$category', count: { $sum: 1 } } }])
  ]);
  res.json({ success: true, stats: { total, archived, today: todayCount, categories: byCategory } });
};
