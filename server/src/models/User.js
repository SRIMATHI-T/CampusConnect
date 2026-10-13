const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true, maxlength: 100 },
  email: { type: String, required: true, unique: true, lowercase: true, trim: true, maxlength: 254 },
  password: { type: String, required: true, select: false },
  // "user" remains accepted for compatibility with existing records.
  role: { type: String, enum: ['admin', 'student', 'user'], default: 'student', required: true }
}, { timestamps: true });

userSchema.pre('save', async function () {
  if (!this.isModified('password')) return;
  if (/^\$2[aby]\$/.test(this.password)) return;
  this.password = await bcrypt.hash(this.password, 12);
});

userSchema.methods.comparePassword = async function (candidate) {
  if (/^\$2[aby]\$/.test(this.password)) return bcrypt.compare(candidate, this.password);
  // Legacy plain-text records are supported only long enough to verify and upgrade.
  const matches = this.password === candidate;
  if (matches) {
    this.password = await bcrypt.hash(candidate, 12);
    await this.save();
  }
  return matches;
};

userSchema.methods.toSafeJSON = function () {
  return { id: this._id, name: this.name, email: this.email, role: this.role === 'user' ? 'student' : this.role };
};
module.exports = mongoose.model('User', userSchema);
