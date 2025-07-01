const Document = require('../models/Document');
const User = require('../models/User');

const extractMentions = (html) => {
  // Extract @username from HTML content
  const matches = html.match(/@([a-zA-Z0-9_]+)/g) || [];
  return [...new Set(matches.map(m => m.slice(1)))];
};

console.log('DOCUMENT CONTROLLER LOADED');

exports.createDocument = async (req, res) => {
  try {
    const { title, content, visibility } = req.body;
    const doc = new Document({
      title,
      content,
      author: req.user.id,
      visibility: visibility || 'private',
      collaborators: [],
    });
    await doc.save();
    const mentionedUsernames = extractMentions(doc.content);
    for (const username of mentionedUsernames) {
      const user = await User.findOne({ username });
      if (user && user._id.toString() !== doc.author.toString()) {
        // Add as collaborator if not already
        if (!doc.collaborators.some(c => c.user.toString() === user._id.toString())) {
          doc.collaborators.push({ user: user._id, permission: 'view' });
          await doc.save();
        }
        // Add notification if not already present for this doc/mention
        const alreadyNotified = user.notifications.some(n => n.type === 'mention' && n.document?.toString() === doc._id.toString());
        if (!alreadyNotified) {
          user.notifications.push({
            type: 'mention',
            message: `You were mentioned in "${doc.title}"`,
            document: doc._id,
          });
          await user.save();
        }
      }
    }
    res.status(201).json(doc);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getDocuments = async (req, res) => {
  try {
    const showDeleted = req.query.deleted === 'true';
    const filter = {
      $or: [
        { author: req.user.id },
        { 'collaborators.user': req.user.id },
        { visibility: 'public' },
      ],
      ...(showDeleted ? { deleted: true } : { deleted: false }),
    };
    const docs = await Document.find(filter)
      .populate('author', 'name email')
      .sort({ updatedAt: -1 });
    res.json(docs);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getDocumentById = async (req, res) => {
  try {
    const doc = await Document.findById(req.params.id).populate('author', 'name email');
    if (!doc) return res.status(404).json({ message: 'Document not found' });
    // Only author, collaborator, or public can view
    if (
      doc.visibility !== 'public' &&
      doc.author._id.toString() !== req.user.id &&
      !doc.collaborators.includes(req.user.id)
    ) {
      return res.status(403).json({ message: 'Access denied' });
    }
    res.json(doc);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.updateDocument = async (req, res) => {
  try {
    const doc = await Document.findById(req.params.id);
    if (!doc) return res.status(404).json({ message: 'Document not found' });
    if (doc.author.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Only the author can edit' });
    }
    // Save old version
    doc.versions.push({
      content: doc.content,
      title: doc.title,
      modifiedAt: new Date(),
      modifiedBy: req.user.id,
    });
    doc.title = req.body.title || doc.title;
    doc.content = req.body.content || doc.content;
    doc.visibility = req.body.visibility || doc.visibility;
    await doc.save();
    const mentionedUsernames = extractMentions(doc.content);
    for (const username of mentionedUsernames) {
      const user = await User.findOne({ username });
      if (user && user._id.toString() !== doc.author.toString()) {
        // Add as collaborator if not already
        if (!doc.collaborators.some(c => c.user.toString() === user._id.toString())) {
          doc.collaborators.push({ user: user._id, permission: 'view' });
          await doc.save();
        }
        // Add notification if not already present for this doc/mention
        const alreadyNotified = user.notifications.some(n => n.type === 'mention' && n.document?.toString() === doc._id.toString());
        if (!alreadyNotified) {
          user.notifications.push({
            type: 'mention',
            message: `You were mentioned in "${doc.title}"`,
            document: doc._id,
          });
          await user.save();
        }
      }
    }
    res.json(doc);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.deleteDocument = async (req, res) => {
  try {
    const doc = await Document.findById(req.params.id);
    if (!doc) return res.status(404).json({ message: 'Document not found' });
    if (doc.author.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Only the author can delete' });
    }
    await doc.deleteOne();
    res.json({ message: 'Document deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.softDeleteDocument = async (req, res) => {
  try {
    const doc = await Document.findById(req.params.id);
    if (!doc) return res.status(404).json({ message: 'Document not found' });
    if (doc.author.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Only the author can delete' });
    }
    doc.deleted = true;
    doc.deletedAt = new Date();
    await doc.save();
    res.json({ message: 'Document moved to trash' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.restoreDocument = async (req, res) => {
  try {
    const doc = await Document.findById(req.params.id);
    if (!doc) return res.status(404).json({ message: 'Document not found' });
    if (doc.author.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Only the author can restore' });
    }
    doc.deleted = false;
    doc.deletedAt = undefined;
    await doc.save();
    res.json({ message: 'Document restored' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.permanentlyDeleteDocument = async (req, res) => {
  try {
    const doc = await Document.findById(req.params.id);
    if (!doc) return res.status(404).json({ message: 'Document not found' });
    if (doc.author.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Only the author can permanently delete' });
    }
    await doc.deleteOne();
    res.json({ message: 'Document permanently deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.addCollaborator = async (req, res) => {
  try {
    const { email, permission } = req.body;
    const doc = await Document.findById(req.params.id);
    if (!doc) return res.status(404).json({ message: 'Document not found' });
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: 'User not found' });
    if (doc.collaborators.some(c => c.user.toString() === user._id.toString())) {
      return res.status(400).json({ message: 'User already a collaborator' });
    }
    doc.collaborators.push({ user: user._id, permission: permission || 'view' });
    await doc.save();
    res.json({ message: 'Collaborator added' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.removeCollaborator = async (req, res) => {
  try {
    const { userId } = req.body;
    const doc = await Document.findById(req.params.id);
    if (!doc) return res.status(404).json({ message: 'Document not found' });
    doc.collaborators = doc.collaborators.filter(c => c.user.toString() !== userId);
    await doc.save();
    res.json({ message: 'Collaborator removed' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.updateCollaboratorPermission = async (req, res) => {
  try {
    const { userId, permission } = req.body;
    const doc = await Document.findById(req.params.id);
    if (!doc) return res.status(404).json({ message: 'Document not found' });
    const collab = doc.collaborators.find(c => c.user.toString() === userId);
    if (!collab) return res.status(404).json({ message: 'Collaborator not found' });
    collab.permission = permission;
    await doc.save();
    res.json({ message: 'Permission updated' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.searchDocuments = async (req, res) => {
  try {
    const { q } = req.query;
    const regex = new RegExp(q, 'i');
    const docs = await Document.find({
      deleted: false,
      $or: [
        { title: regex },
        { content: regex },
      ],
      $or: [
        { author: req.user.id },
        { 'collaborators.user': req.user.id },
        { visibility: 'public' },
      ],
    }).populate('author', 'name email').sort({ updatedAt: -1 });
    res.json(docs);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getMyDocuments = async (req, res) => {
  console.log('HIT getMyDocuments, req.user:', req.user); // Debug log
  try {
    const docs = await Document.find({ author: req.user.id, deleted: false })
      .populate('author', 'name email')
      .sort({ updatedAt: -1 });
    res.json(docs);
  } catch (err) {
    console.error('getMyDocuments error:', err);
    res.status(500).json({ message: err.message });
  }
};

exports.getTrashDocuments = async (req, res) => {
  console.log('HIT getTrashDocuments, req.user:', req.user); // Debug log
  try {
    const docs = await Document.find({ author: req.user.id, deleted: true })
      .populate('author', 'name email')
      .sort({ updatedAt: -1 });
    res.json(docs);
  } catch (err) {
    console.error('getTrashDocuments error:', err);
    res.status(500).json({ message: err.message });
  }
}; 