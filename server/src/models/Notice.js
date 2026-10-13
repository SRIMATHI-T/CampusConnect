const mongoose = require('mongoose');
const noticeSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true, maxlength: 180 },
  content: { type: String, required: true, trim: true, maxlength: 12000 },
  category: { type: String, enum: ['General', 'Placement', 'Exam', 'Event', 'Other'], default: 'General' },
  postedBy: { type: String, required: true, trim: true, maxlength: 100 },
  postedById: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
  imageUrl: { type: String, default: null },
  date: { type: Date, default: Date.now },
  archived: { type: Boolean, default: false },
  archivedDate: { type: Date, default: null }
}, { timestamps: true });
noticeSchema.index({ title: 'text', content: 'text' });
module.exports = mongoose.model('Notice', noticeSchema);
