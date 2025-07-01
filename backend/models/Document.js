const mongoose = require('mongoose');

const collaboratorSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  permission: { type: String, enum: ['view', 'edit'], default: 'view' },
});

const versionSchema = new mongoose.Schema({
  content: String,
  title: String,
  modifiedAt: Date,
  modifiedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
});

const documentSchema = new mongoose.Schema({
  title: { type: String, required: true },
  content: { type: String, required: true },
  author: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  lastModified: { type: Date, default: Date.now },
  visibility: { type: String, enum: ['public', 'private'], default: 'private' },
  collaborators: [collaboratorSchema],
  deleted: { type: Boolean, default: false },
  deletedAt: { type: Date },
  versions: [versionSchema],
}, { timestamps: true });

module.exports = mongoose.model('Document', documentSchema); 