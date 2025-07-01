const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
  type: { type: String, enum: ['mention', 'share'], required: true },
  message: String,
  document: { type: mongoose.Schema.Types.ObjectId, ref: 'Document' },
  read: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
});

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: false, default: '' },
  resetPasswordToken: { type: String },
  resetPasswordExpires: { type: Date },
  notifications: [notificationSchema],
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema); 