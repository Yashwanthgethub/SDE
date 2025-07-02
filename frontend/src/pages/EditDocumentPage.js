import React, { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getDocumentById, updateDocument } from '../services/documentService';
import { Box, Paper, TextField, Button, Typography, CircularProgress, Alert, MenuItem, Avatar, Chip, Divider } from '@mui/material';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Mention from '@tiptap/extension-mention';
import axios from 'axios';

const EditDocumentPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [visibility, setVisibility] = useState('private');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [lastSaved, setLastSaved] = useState({ title: '', content: '', visibility: '' });
  const [autoSaving, setAutoSaving] = useState(false);
  const autoSaveTimer = useRef(null);
  const [userSuggestions, setUserSuggestions] = useState([]);
  const [doc, setDoc] = useState(null);

  const editor = useEditor({
    extensions: [StarterKit, Mention.configure({
      HTMLAttributes: {
        class: 'mention',
        style: 'color: #1976d2; background: #e3eefd; border-radius: 4px; padding: 0 4px;'
      },
      suggestion: {
        items: ({ query }) => {
          return userSuggestions
            .filter(user => user.name.toLowerCase().includes(query.toLowerCase()) || user.email.toLowerCase().includes(query.toLowerCase()))
            .slice(0, 5);
        },
        render: () => {
          let component;
          return {
            onStart: props => {
              component = document.createElement('div');
              component.style.background = '#fff';
              component.style.border = '1px solid #1976d2';
              component.style.borderRadius = '8px';
              component.style.boxShadow = '0 2px 8px rgba(0,0,0,0.08)';
              component.style.padding = '4px 0';
              component.style.zIndex = 1000;
              component.style.position = 'absolute';
              component.style.minWidth = '180px';
              props.clientRect && Object.assign(component.style, {
                left: `${props.clientRect().left}px`,
                top: `${props.clientRect().bottom + 4}px`,
              });
              update(props);
              document.body.appendChild(component);
            },
            onUpdate: update,
            onExit: () => {
              component && component.remove();
            }
          };
          function update(props) {
            if (!component) return;
            component.innerHTML = '';
            props.items.forEach(user => {
              const item = document.createElement('div');
              item.textContent = `${user.name} (${user.email})`;
              item.style.padding = '6px 12px';
              item.style.cursor = 'pointer';
              item.onmousedown = e => {
                e.preventDefault();
                props.command({ id: user.id, label: user.name });
              };
              component.appendChild(item);
            });
          }
        }
      }
    })],
    content,
    onUpdate: ({ editor }) => setContent(editor.getHTML()),
  });

  useEffect(() => {
    const fetchDoc = async () => {
      setLoading(true);
      try {
        const loadedDoc = await getDocumentById(id);
        setDoc(loadedDoc);
        setTitle(loadedDoc.title);
        setContent(loadedDoc.content);
        setVisibility(loadedDoc.visibility || 'private');
      } catch (err) {
        setError('Failed to load document');
      } finally {
        setLoading(false);
      }
    };
    fetchDoc();
  }, [id]);

  // Auto-save effect
  useEffect(() => {
    if (loading) return;
    if (autoSaveTimer.current) clearInterval(autoSaveTimer.current);
    autoSaveTimer.current = setInterval(() => {
      if (
        title !== lastSaved.title ||
        content !== lastSaved.content ||
        visibility !== lastSaved.visibility
      ) {
        setAutoSaving(true);
        updateDocument(id, { title, content, visibility })
          .then(() => setLastSaved({ title, content, visibility }))
          .finally(() => setAutoSaving(false));
      }
    }, 5000);
    return () => clearInterval(autoSaveTimer.current);
  }, [title, content, visibility, id, loading, lastSaved]);

  // Fetch user suggestions for mentions
  useEffect(() => {
    axios.get('/api/auth/users', { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } })
      .then(res => setUserSuggestions(res.data))
      .catch(() => setUserSuggestions([]));
  }, []);

  const handleSave = async () => {
    setSaving(true);
    setError('');
    try {
      await updateDocument(id, { title, content, visibility });
      navigate(`/document/${id}`);
    } catch (err) {
      setError('Failed to save changes');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh"><CircularProgress /></Box>;

  return (
    <Box minHeight="100vh" display="flex" alignItems="center" justifyContent="center" sx={{ background: 'linear-gradient(135deg, #e3eefd 0%, #f5f7fa 100%)' }}>
      <Paper elevation={6} sx={{ p: 5, minWidth: 480, maxWidth: 700, borderRadius: 5, boxShadow: 6, position: 'relative' }}>
        <Typography variant="h4" fontWeight={700} mb={2} color="primary">Edit Document</Typography>
        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
        <Divider sx={{ mb: 2 }} />
        <Box display="flex" alignItems="center" gap={2} mb={2}>
          {doc && doc.author && <><Avatar sx={{ width: 32, height: 32 }}>{doc.author.name[0]}</Avatar><Typography variant="subtitle1">{doc.author.name}</Typography></>}
          <Box flexGrow={1} />
          <Chip label={visibility.charAt(0).toUpperCase() + visibility.slice(1)} color={visibility === 'public' ? 'primary' : 'default'} size="small" />
        </Box>
        <TextField
          label="Title"
          fullWidth
          margin="normal"
          value={title}
          onChange={e => setTitle(e.target.value)}
          required
          sx={{ fontWeight: 600, fontSize: 22 }}
        />
        <EditorContent editor={editor} style={{ minHeight: 220, marginBottom: 20, border: '1px solid #1976d2', borderRadius: 8, padding: 12, background: '#fff', fontSize: 18 }} />
        <TextField
          select
          label="Visibility"
          fullWidth
          margin="normal"
          value={visibility}
          onChange={e => setVisibility(e.target.value)}
        >
          <MenuItem value="private">Private</MenuItem>
          <MenuItem value="public">Public</MenuItem>
        </TextField>
        {autoSaving && <Typography variant="caption" color="text.secondary">Auto-saving...</Typography>}
        <Divider sx={{ my: 2 }} />
        <Box display="flex" alignItems="center" justifyContent="space-between" gap={2}>
          <Box>
            <Typography variant="caption" color="text.secondary">Last modified: {doc && doc.updatedAt ? new Date(doc.updatedAt).toLocaleString() : ''}</Typography>
          </Box>
          <Box display="flex" gap={1}>
            {doc && doc.collaborators && doc.collaborators.map(c => (
              <Chip key={c.user} label={c.permission} size="small" />
            ))}
          </Box>
          <Box>
            <Button variant="contained" color="primary" onClick={handleSave} disabled={saving} sx={{ px: 4, py: 1.5, fontWeight: 600, fontSize: 16, borderRadius: 3, boxShadow: 2 }}>{saving ? 'Saving...' : 'Save'}</Button>
            <Button variant="outlined" color="secondary" onClick={() => navigate(-1)} disabled={saving} sx={{ ml: 2, px: 3, py: 1.5, fontWeight: 500, fontSize: 15, borderRadius: 3 }}>Cancel</Button>
          </Box>
        </Box>
      </Paper>
    </Box>
  );
};

export default EditDocumentPage; 