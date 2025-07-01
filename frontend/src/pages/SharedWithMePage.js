import React, { useEffect, useState } from 'react';
import { Box, Grid, Card, CardContent, Typography, CircularProgress, IconButton, Chip, Tooltip, Menu, MenuItem } from '@mui/material';
import { getDocuments } from '../services/documentService';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const SharedWithMePage = () => {
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [menuDocId, setMenuDocId] = useState(null);
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchDocs = async () => {
      setLoading(true);
      try {
        const docs = await getDocuments();
        setDocuments(
          docs.filter(doc =>
            doc.collaborators?.some(c => c.user === user?.id || c.user?._id === user?.id)
          )
        );
      } catch {
        setDocuments([]);
      } finally {
        setLoading(false);
      }
    };
    fetchDocs();
  }, [user]);

  const handleMenuOpen = (event, docId) => {
    setMenuDocId(docId);
  };
  const handleMenuClose = () => {
    setMenuDocId(null);
  };

  return (
    <Box p={4}>
      <Typography variant="h5" mb={2}>Shared with Me</Typography>
      {loading ? <CircularProgress /> : (
        <Grid container spacing={2}>
          {documents.map((doc) => (
            <Grid item key={doc._id} xs={12} sm={6} md={4}>
              <Card>
                <CardContent>
                  <Typography variant="h6" fontWeight={700} gutterBottom sx={{ cursor: 'pointer' }} onClick={() => navigate(`/document/${doc._id}`)}>{doc.title}</Typography>
                  <Typography variant="body2">By {doc.author?.name || 'Unknown'}</Typography>
                  <Typography variant="body2" color="text.secondary">Modified {new Date(doc.updatedAt).toLocaleString()}</Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}
    </Box>
  );
};

export default SharedWithMePage; 