import React, { useState } from 'react';
import { Box, Typography, TextField, Button, Radio, RadioGroup, FormControlLabel, FormLabel, CircularProgress, Alert, Paper } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { createDocument } from '../services/documentService';

const NewDocumentPage = () => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [visibility, setVisibility] = useState('private');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await createDocument(title, content, visibility);
      navigate('/dashboard');
    } catch (err) {
      setError(err?.response?.data?.message || 'Failed to create document');
    }
    setLoading(false);
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
          <TextField
            label="Content"
            fullWidth
            required
            margin="normal"
            multiline
            minRows={10}
            value={content}
            onChange={e => setContent(e.target.value)}
            disabled={loading}
            sx={{ fontSize: 18 }}
          />
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
      </Paper>
    </Box>
  );
};

export default NewDocumentPage; 