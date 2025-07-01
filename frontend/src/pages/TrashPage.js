import React, { useEffect, useState, useCallback } from 'react';
import { Box, Typography, Grid, Card, CardContent, Button, CircularProgress, IconButton, Alert } from '@mui/material';
import DescriptionIcon from '@mui/icons-material/Description';
import RestoreIcon from '@mui/icons-material/Restore';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import { getTrashDocuments, restoreDocument, permanentlyDeleteDocument } from '../services/documentService';
import { useAuth } from '../context/AuthContext';

const TrashPage = () => {
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [processingId, setProcessingId] = useState(null);
  const { user } = useAuth();

  const fetchTrash = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const docs = await getTrashDocuments();
      setDocuments(docs);
    } catch (err) {
      setError('Failed to load trash');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchTrash();
  }, [fetchTrash]);

  const handleRestore = async (id) => {
    setProcessingId(id);
    setError('');
    setSuccess('');
    try {
      await restoreDocument(id);
      setSuccess('Document restored');
      fetchTrash();
    } catch (err) {
      setError('Failed to restore document');
    } finally {
      setProcessingId(null);
    }
  };

  const handleDelete = async (id) => {
    setProcessingId(id);
    setError('');
    setSuccess('');
    try {
      await permanentlyDeleteDocument(id);
      setSuccess('Document permanently deleted');
      fetchTrash();
    } catch (err) {
      setError('Failed to delete document');
    } finally {
      setProcessingId(null);
    }
  };

  return (
    <Box p={4}>
      <Typography variant="h5" mb={2}>Trash</Typography>
      <Typography color="text.secondary" mb={3}>Documents you've deleted</Typography>
      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
      {success && <Alert severity="success" sx={{ mb: 2 }}>{success}</Alert>}
      <Grid container columnSpacing={3} rowSpacing={3}>
        {loading ? (
          <Grid textAlign="center"><CircularProgress /></Grid>
        ) : documents.length === 0 ? (
          <Grid textAlign="center" width="100%"><Typography>No deleted documents.</Typography></Grid>
        ) : (
          documents.map((doc) => (
            <Grid key={doc._id}>
              <Card sx={{ p: 2, borderRadius: 4, boxShadow: 2, minWidth: 320, minHeight: 180 }}>
                <CardContent>
                  <Box display="flex" alignItems="center" gap={1} mb={1}>
                    <DescriptionIcon color="primary" />
                    <Typography variant="h6" fontWeight={700} gutterBottom>{doc.title}</Typography>
                  </Box>
                  <Typography color="text.secondary" mb={1} sx={{ minHeight: 32 }}>
                    {doc.content.replace(/<[^>]+>/g, '').slice(0, 100)}...
                  </Typography>
                  <Box display="flex" gap={2} mt={2}>
                    <Button
                      variant="outlined"
                      color="success"
                      startIcon={<RestoreIcon />}
                      onClick={() => handleRestore(doc._id)}
                      disabled={processingId === doc._id}
                    >
                      {processingId === doc._id ? <CircularProgress size={18} /> : 'Restore'}
                    </Button>
                    <Button
                      variant="outlined"
                      color="error"
                      startIcon={<DeleteForeverIcon />}
                      onClick={() => handleDelete(doc._id)}
                      disabled={processingId === doc._id}
                    >
                      {processingId === doc._id ? <CircularProgress size={18} /> : 'Delete'}
                    </Button>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))
        )}
      </Grid>
    </Box>
  );
};

export default TrashPage; 