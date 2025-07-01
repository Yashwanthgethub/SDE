import React, { useEffect, useState } from 'react';
import { Box, Grid, Card, CardContent, Typography, CircularProgress, IconButton, Chip, Tooltip, Menu, MenuItem } from '@mui/material';
import { getMyDocuments, deleteDocument } from '../services/documentService';
import DescriptionIcon from '@mui/icons-material/Description';
import PublicIcon from '@mui/icons-material/Public';
import LockIcon from '@mui/icons-material/Lock';
import GroupIcon from '@mui/icons-material/Group';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const MyDocumentsPage = () => {
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [anchorEl, setAnchorEl] = useState(null);
  const [menuDocId, setMenuDocId] = useState(null);
  const { user } = useAuth();
  const [processingId, setProcessingId] = useState(null);
  const navigate = useNavigate();

  const fetchDocs = async () => {
    setLoading(true);
    try {
      const docs = await getMyDocuments();
      setDocuments(docs);
    } catch {
      setDocuments([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDocs();
  }, [user]);

  const handleMenuOpen = (event, docId) => {
    setAnchorEl(event.currentTarget);
    setMenuDocId(docId);
  };
  const handleMenuClose = () => {
    setAnchorEl(null);
    setMenuDocId(null);
  };

  const handleDelete = async (id) => {
    setProcessingId(id);
    try {
      await deleteDocument(id);
      fetchDocs();
    } catch (err) {
      // Optionally handle error
    } finally {
      setProcessingId(null);
    }
  };

  return (
    <Box p={4}>
      <Typography variant="h5" mb={2}>My Documents</Typography>
      <Grid container columnSpacing={3} rowSpacing={3}>
        {loading ? (
          <Grid textAlign="center"><CircularProgress /></Grid>
        ) : (
          documents.map((doc) => (
            <Grid key={doc._id}>
              <Card sx={{ p: 2, borderRadius: 4, boxShadow: 2, transition: '0.2s', '&:hover': { boxShadow: 8, transform: 'translateY(-4px)' }, minWidth: 320, minHeight: 220, position: 'relative' }}>
                <CardContent>
                  <Box display="flex" alignItems="center" gap={1} mb={1}>
                    <DescriptionIcon color="primary" />
                    <Typography variant="h6" fontWeight={700} gutterBottom sx={{ cursor: 'pointer' }} onClick={() => navigate(`/document/${doc._id}`)}>{doc.title}</Typography>
                    <Box flexGrow={1} />
                    <Tooltip title={doc.visibility === 'public' ? 'Public' : 'Private'}>
                      <Chip
                        icon={doc.visibility === 'public' ? <PublicIcon /> : <LockIcon />}
                        label={doc.visibility.charAt(0).toUpperCase() + doc.visibility.slice(1)}
                        color={doc.visibility === 'public' ? 'primary' : 'default'}
                        size="small"
                        sx={{ fontWeight: 600 }}
                      />
                    </Tooltip>
                    <Tooltip title="Edit">
                      <IconButton size="small" onClick={() => navigate(`/edit/${doc._id}`)}>
                        <EditIcon />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Delete">
                      <IconButton size="small" onClick={() => handleDelete(doc._id)} disabled={processingId === doc._id}>
                        {processingId === doc._id ? <CircularProgress size={18} /> : <DeleteIcon />}
                      </IconButton>
                    </Tooltip>
                    <IconButton size="small" onClick={e => handleMenuOpen(e, doc._id)}>
                      <MoreVertIcon />
                    </IconButton>
                    <Menu anchorEl={anchorEl} open={menuDocId === doc._id} onClose={handleMenuClose}>
                      <MenuItem onClick={handleMenuClose}>View</MenuItem>
                      <MenuItem onClick={() => { navigate(`/edit/${doc._id}`); handleMenuClose(); }}>Edit</MenuItem>
                      <MenuItem onClick={handleMenuClose}>Share</MenuItem>
                      <MenuItem onClick={() => { handleDelete(doc._id); handleMenuClose(); }} sx={{ color: 'error.main' }} disabled={processingId === doc._id}>
                        {processingId === doc._id ? <CircularProgress size={18} /> : 'Delete'}
                      </MenuItem>
                    </Menu>
                  </Box>
                  <Typography color="text.secondary" mb={1} sx={{ minHeight: 48 }}>
                    {doc.content.replace(/<[^>]+>/g, '').slice(0, 100)}...
                  </Typography>
                  <Box display="flex" alignItems="center" gap={2} mt={2}>
                    <Typography variant="body2">By {doc.author?.name || 'Unknown'}</Typography>
                    <Typography variant="body2" color="text.secondary">Modified {new Date(doc.updatedAt).toLocaleString()}</Typography>
                  </Box>
                  <Box display="flex" alignItems="center" gap={2} mt={1}>
                    <GroupIcon fontSize="small" sx={{ color: '#1976d2' }} />
                    <Typography variant="caption">{doc.collaborators?.length || 0} collaborators</Typography>
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

export default MyDocumentsPage; 