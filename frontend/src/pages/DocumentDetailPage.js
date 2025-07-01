import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Box, Typography, CircularProgress, Button, Dialog, DialogTitle, DialogContent, DialogActions, TextField, Alert } from '@mui/material';
import { getDocumentById, addCollaborator } from '../services/documentService';

const DocumentDetailPage = () => {
  const { id } = useParams();
  const [document, setDocument] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [shareOpen, setShareOpen] = useState(false);
  const [shareEmail, setShareEmail] = useState('');
  const [shareSuccess, setShareSuccess] = useState('');
  const [shareError, setShareError] = useState('');
  const [shareLoading, setShareLoading] = useState(false);

  useEffect(() => {
    const fetchDoc = async () => {
      setLoading(true);
      setError('');
      try {
        const doc = await getDocumentById(id);
        setDocument(doc);
      } catch {
        setError('Failed to load document');
      } finally {
        setLoading(false);
      }
    };
    fetchDoc();
  }, [id]);

  const handleShare = async () => {
    setShareLoading(true);
    setShareSuccess('');
    setShareError('');
    try {
      await addCollaborator(id, shareEmail, 'edit');
      setShareSuccess('Document shared successfully!');
      setShareEmail('');
    } catch (err) {
      setShareError(err?.response?.data?.message || 'Failed to share document');
    } finally {
      setShareLoading(false);
    }
  };

  if (loading) return <Box p={4}><CircularProgress /></Box>;
  if (error) return <Box p={4}><Alert severity="error">{error}</Alert></Box>;
  if (!document) return null;

  return (
    <Box p={4}>
      <Typography variant="h4" mb={2}>{document.title}</Typography>
      <Typography color="text.secondary" mb={2}>By {document.author?.name || 'Unknown'}</Typography>
      <Box mb={3}>
        <div dangerouslySetInnerHTML={{ __html: document.content }} />
      </Box>
      <Button variant="contained" onClick={() => setShareOpen(true)}>Share</Button>
      <Dialog open={shareOpen} onClose={() => setShareOpen(false)}>
        <DialogTitle>Share Document</DialogTitle>
        <DialogContent>
          <TextField
            label="Recipient Email"
            value={shareEmail}
            onChange={e => setShareEmail(e.target.value)}
            fullWidth
            margin="normal"
          />
          {shareSuccess && <Alert severity="success" sx={{ mt: 2 }}>{shareSuccess}</Alert>}
          {shareError && <Alert severity="error" sx={{ mt: 2 }}>{shareError}</Alert>}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShareOpen(false)}>Cancel</Button>
          <Button onClick={handleShare} variant="contained" disabled={shareLoading || !shareEmail}>
            {shareLoading ? 'Sharing...' : 'Share'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default DocumentDetailPage; 