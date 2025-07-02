import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Box, Typography, CircularProgress, Button, Dialog, DialogTitle, DialogContent, DialogActions, TextField, Alert, List, ListItem, ListItemText, IconButton, Paper, Chip, Avatar, Divider } from '@mui/material';
import { getDocumentById, addCollaborator } from '../services/documentService';
import HistoryIcon from '@mui/icons-material/History';
import CompareArrowsIcon from '@mui/icons-material/CompareArrows';
import PublicIcon from '@mui/icons-material/Public';

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
  const [historyOpen, setHistoryOpen] = useState(false);
  const [diffOpen, setDiffOpen] = useState(false);
  const [diffHtmlContent, setDiffHtmlContent] = useState('');
  const [selectedVersion, setSelectedVersion] = useState(null);

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

  // Simple HTML diff function
  function diffHtml(oldHtml, newHtml) {
    if (!oldHtml || !newHtml) return '';
    // Very basic diff: highlight removed (red) and added (green) text
    // For production, use a library like diff2html
    let diff = '';
    if (oldHtml === newHtml) return '<span>No changes</span>';
    diff += `<div><b>Previous Version:</b></div><div style="background:#ffeaea;padding:8px;border-radius:4px;">${oldHtml}</div>`;
    diff += `<div><b>Current Version:</b></div><div style="background:#eaffea;padding:8px;border-radius:4px;">${newHtml}</div>`;
    return diff;
  }

  if (loading) return <Box p={4}><CircularProgress /></Box>;
  if (error) return <Box p={4}><Alert severity="error">{error}</Alert></Box>;
  if (!document) return null;

  return (
    <Box minHeight="100vh" display="flex" alignItems="center" justifyContent="center" sx={{ background: 'linear-gradient(135deg, #e3eefd 0%, #f5f7fa 100%)' }}>
      <Paper elevation={6} sx={{ p: 5, minWidth: 480, maxWidth: 800, borderRadius: 5, boxShadow: 6, position: 'relative' }}>
        <Box display="flex" alignItems="center" gap={2} mb={2}>
          <Avatar sx={{ width: 40, height: 40 }}>{document.author?.name?.[0]}</Avatar>
          <Box>
            <Typography variant="h4" fontWeight={700} color="primary" mb={0.5}>{document.title}</Typography>
            <Typography color="text.secondary" variant="subtitle1">By {document.author?.name || 'Unknown'}</Typography>
          </Box>
          <Box flexGrow={1} />
          {document.visibility === 'public' && <Chip icon={<PublicIcon />} label="Public" color="primary" sx={{ fontWeight: 600, fontSize: 15 }} />}
        </Box>
        <Divider sx={{ mb: 2 }} />
        <Box mb={3} sx={{ background: '#fff', borderRadius: 3, p: 3, boxShadow: 1, minHeight: 180 }}>
          <Typography variant="subtitle2" color="text.secondary" mb={1}>Document Content</Typography>
          <div dangerouslySetInnerHTML={{ __html: document.content }} />
        </Box>
        <Box display="flex" alignItems="center" gap={2} mb={2}>
          <Button variant="contained" onClick={() => setShareOpen(true)} sx={{ mr: 2 }}>Share</Button>
          <Button variant="outlined" startIcon={<HistoryIcon />} onClick={() => setHistoryOpen(true)} sx={{ mb: 2 }}>Version History</Button>
        </Box>
        <Divider sx={{ my: 2 }} />
        <Typography variant="caption" color="text.secondary">Last modified: {document.updatedAt ? new Date(document.updatedAt).toLocaleString() : ''}</Typography>
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
        <Dialog open={historyOpen} onClose={() => setHistoryOpen(false)} maxWidth="md" fullWidth>
          <DialogTitle>Version History</DialogTitle>
          <DialogContent>
            <List>
              {document.versions && document.versions.length > 0 ? document.versions.map((v, idx) => (
                <ListItem key={idx} secondaryAction={
                  <IconButton edge="end" onClick={() => { setSelectedVersion(v); setDiffHtmlContent(diffHtml(v.content, document.content)); setDiffOpen(true); }}>
                    <CompareArrowsIcon />
                  </IconButton>
                }>
                  <ListItemText
                    primary={`Edited by ${v.modifiedBy?.name || 'Unknown'}`}
                    secondary={v.modifiedAt ? new Date(v.modifiedAt).toLocaleString() : ''}
                  />
                </ListItem>
              )) : <Typography>No previous versions.</Typography>}
            </List>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setHistoryOpen(false)}>Close</Button>
          </DialogActions>
        </Dialog>
        <Dialog open={diffOpen} onClose={() => setDiffOpen(false)} maxWidth="md" fullWidth>
          <DialogTitle>Compare Version</DialogTitle>
          <DialogContent>
            <div dangerouslySetInnerHTML={{ __html: diffHtmlContent }} />
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setDiffOpen(false)}>Close</Button>
          </DialogActions>
        </Dialog>
      </Paper>
    </Box>
  );
};

export default DocumentDetailPage; 