console.log('DOCUMENT ROUTES LOADED');
const express = require('express');
const router = express.Router();
const documentController = require('../controllers/documentController');
const auth = require('../middleware/auth');

router.get('/my', auth, documentController.getMyDocuments);
router.get('/trash', auth, documentController.getTrashDocuments);
router.post('/', auth, documentController.createDocument);
router.get('/', auth, documentController.getDocuments);
router.get('/:id', auth, documentController.getDocumentById);
router.put('/:id', auth, documentController.updateDocument);
router.delete('/:id', auth, documentController.deleteDocument);
router.patch('/:id/soft-delete', auth, documentController.softDeleteDocument);
router.patch('/:id/restore', auth, documentController.restoreDocument);
router.delete('/:id/permanent', auth, documentController.permanentlyDeleteDocument);
router.post('/:id/collaborators', auth, documentController.addCollaborator);
router.delete('/:id/collaborators', auth, documentController.removeCollaborator);
router.patch('/:id/collaborators', auth, documentController.updateCollaboratorPermission);
router.get('/search', auth, documentController.searchDocuments);

module.exports = router; 