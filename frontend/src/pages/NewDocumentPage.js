import React, { useState, useEffect, useRef } from 'react';
import { Box, Typography, TextField, Button, Radio, RadioGroup, FormControlLabel, FormLabel, CircularProgress, Alert, Paper } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { createDocument, updateDocument } from '../services/documentService';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';

const NewDocumentPage = () => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [visibility, setVisibility] = useState('private');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [docId, setDocId] = useState(null);
  const [lastSaved, setLastSaved] = useState({ title: '', content: '', visibility: '' });
  const [autoSaving, setAutoSaving] = useState(false);
  const autoSaveTimer = useRef(null);
  const navigate = useNavigate();

  const editor = useEditor({
    extensions: [StarterKit],
    content,
    onUpdate: ({ editor }) => setContent(editor.getHTML()),
  });

  // Auto-save effect (only after doc is created)
  useEffect(() => {
    if (!docId) return;
    if (autoSaveTimer.current) clearInterval(autoSaveTimer.current);
    autoSaveTimer.current = setInterval(() => {
      if (
        title !== lastSaved.title ||
        content !== lastSaved.content ||
        visibility !== lastSaved.visibility
      ) {
        setAutoSaving(true);
        updateDocument(docId, { title, content, visibility })
          .then(() => setLastSaved({ title, content, visibility }))
          .finally(() => setAutoSaving(false));
      }
    }, 5000);
    return () => clearInterval(autoSaveTimer.current);
  }, [title, content, visibility, docId, lastSaved]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const doc = await createDocument(title, content, visibility);
      setDocId(doc._id);
      setLastSaved({ title, content, visibility });
      navigate(`/document/${doc._id}`);
    } catch (err) {
      setError(err?.response?.data?.message || 'Failed to create document');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh" bgcolor="#f8fafc">
      <Paper sx={{ p: { xs: 2, md: 6 }, width: { xs: '98%', sm: '90%', md: '75%' }, maxWidth: 900, boxShadow: 4 }}>
        <Typography variant="h4" fontWeight={700} mb={2}>Create New Document</Typography>
        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
        <form onSubmit={handleSubmit}>
          <TextField
            label="Title"
            fullWidth
            required
            margin="normal"
            value={title}
            onChange={e => setTitle(e.target.value)}
            disabled={loading}
            sx={{ fontSize: 20 }}
          />
          <EditorContent editor={editor} style={{ minHeight: 200, marginBottom: 16, border: '1px solid #ccc', borderRadius: 8, padding: 8, background: '#fff' }} />
          <Box mt={3} mb={3}>
            <FormLabel component="legend">Visibility</FormLabel>
            <RadioGroup row value={visibility} onChange={e => setVisibility(e.target.value)}>
              <FormControlLabel value="private" control={<Radio />} label="Private" />
              <FormControlLabel value="public" control={<Radio />} label="Public" />
            </RadioGroup>
          </Box>
          <Button type="submit" variant="contained" color="primary" fullWidth size="large" sx={{ py: 1.5, fontSize: 18 }} disabled={loading || !title.trim() || !content.trim()}>
            {loading ? <CircularProgress size={22} /> : 'Create Document'}
          </Button>
        </form>
        {autoSaving && <Typography variant="caption" color="text.secondary">Auto-saving...</Typography>}
      </Paper>
    </Box>
  );
};

export default NewDocumentPage; 