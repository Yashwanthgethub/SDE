import React, { useState, useEffect } from 'react';
import {
  Box, Grid, Card, CardContent, Typography, Button, TextField, Chip, Avatar, IconButton, InputAdornment, Menu, MenuItem, Dialog, DialogTitle, DialogContent, DialogActions, Radio, RadioGroup, FormControlLabel, FormLabel, CircularProgress, Alert
} from '@mui/material';
import DescriptionIcon from '@mui/icons-material/Description';
import PublicIcon from '@mui/icons-material/Public';
import LockIcon from '@mui/icons-material/Lock';
import GroupIcon from '@mui/icons-material/Group';
import NotificationsIcon from '@mui/icons-material/Notifications';
import SearchIcon from '@mui/icons-material/Search';
import ViewModuleIcon from '@mui/icons-material/ViewModule';
import ViewListIcon from '@mui/icons-material/ViewList';
import Sidebar from '../components/Sidebar';
import { createDocument, getDocuments } from '../services/documentService';
import { useNavigate } from 'react-router-dom';

const FILTERS = [
  { label: 'All Documents', value: 'all' },
  { label: 'Public', value: 'public' },
  { label: 'Private', value: 'private' },
];

const DashboardPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterBy, setFilterBy] = useState('all');
  const [viewMode, setViewMode] = useState('grid');
  const [anchorEl, setAnchorEl] = useState(null);
  const [profileAnchorEl, setProfileAnchorEl] = useState(null);
  const [documents, setDocuments] = useState([]);
  const [openNewDoc, setOpenNewDoc] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newContent, setNewContent] = useState('');
  const [newVisibility, setNewVisibility] = useState('private');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    fetchDocuments();
  }, []);

  const fetchDocuments = async () => {
    setLoading(true);
    setError('');
    try {
      const docs = await getDocuments();
      setDocuments(docs);
    } catch (err) {
      setError('Failed to fetch documents');
    }
    setLoading(false);
  };

  const filteredDocuments = documents.filter(doc => {
    const matchesSearch = doc.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (doc.content && doc.content.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesFilter = filterBy === 'all' ||
      (filterBy === 'public' && doc.visibility === 'public') ||
      (filterBy === 'private' && doc.visibility === 'private');
    return matchesSearch && matchesFilter;
  });

  const handleFilterClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleFilterClose = () => {
    setAnchorEl(null);
  };
  const handleFilterSelect = (value) => {
    setFilterBy(value);
    setAnchorEl(null);
  };
  const handleProfileMenuOpen = (event) => setProfileAnchorEl(event.currentTarget);
  const handleProfileMenuClose = () => setProfileAnchorEl(null);
  const handleLogout = () => { setProfileAnchorEl(null); /* Add logout logic here */ };

  const handleCreateDocument = async () => {
    if (!newTitle.trim()) return;
    setLoading(true);
    setError('');
    try {
      // Connect to backend
      const doc = await createDocument(newTitle, newContent, newVisibility);
      // Optionally, navigate to the new document's page here
      // Refresh document list from backend
      const docs = await getDocuments();
      setDocuments(docs);
      setOpenNewDoc(false);
      setNewTitle('');
      setNewContent('');
      setNewVisibility('private');
    } catch (err) {
      setError(err?.response?.data?.message || 'Failed to create document');
    }
    setLoading(false);
  };

  return (
    <Box display="flex" sx={{ bgcolor: '#f8fafc', minHeight: '100vh' }}>
      <Sidebar />
      <Box flexGrow={1} sx={{ marginLeft: { xs: 0, md: '260px' }, minHeight: '100vh', bgcolor: '#f8fafc' }}>
        {/* Main Content */}
        <Box sx={{ maxWidth: 1400, mx: 'auto', p: { xs: 2, md: 4 }, pt: { xs: 2, md: 3 } }}>
          {/* Header and Controls */}
          <Box display="flex" flexDirection={{ xs: 'column', md: 'row' }} alignItems={{ xs: 'flex-start', md: 'center' }} justifyContent="space-between" mb={4} gap={2}>
            <Box>
              <Typography variant="h3" fontWeight={800} sx={{ color: '#1a202c', mb: 0.5, fontSize: { xs: 28, md: 36 } }}>Knowledge Base</Typography>
              <Typography variant="h6" sx={{ color: '#718096', fontWeight: 400, fontSize: { xs: 15, md: 18 } }}>
                Manage and organize your team's documents
              </Typography>
            </Box>
            <Box display="flex" alignItems="center" gap={2}>
              <Button variant="contained" color="primary" sx={{ borderRadius: 2, fontWeight: 600, px: 4, py: 1.5, minWidth: 180 }} onClick={() => navigate('/new-document')}>+ New Document</Button>
            </Box>
          </Box>
          {/* New Document Dialog */}
          <Dialog open={openNewDoc} onClose={() => setOpenNewDoc(false)}>
            <DialogTitle>Create New Document</DialogTitle>
            <DialogContent sx={{ minWidth: 350, display: 'flex', flexDirection: 'column', gap: 2 }}>
              {error && <Alert severity="error">{error}</Alert>}
              <TextField
                autoFocus
                margin="dense"
                label="Title"
                fullWidth
                value={newTitle}
                onChange={e => setNewTitle(e.target.value)}
                disabled={loading}
              />
              <TextField
                margin="dense"
                label="Content"
                fullWidth
                multiline
                minRows={4}
                value={newContent}
                onChange={e => setNewContent(e.target.value)}
                disabled={loading}
              />
              <Box mt={2}>
                <FormLabel component="legend">Visibility</FormLabel>
                <RadioGroup row value={newVisibility} onChange={e => setNewVisibility(e.target.value)}>
                  <FormControlLabel value="private" control={<Radio />} label="Private" />
                  <FormControlLabel value="public" control={<Radio />} label="Public" />
                </RadioGroup>
              </Box>
            </DialogContent>
            <DialogActions>
              <Button onClick={() => setOpenNewDoc(false)} disabled={loading}>Cancel</Button>
              <Button onClick={handleCreateDocument} variant="contained" disabled={loading || !newTitle.trim()}>
                {loading ? <CircularProgress size={22} /> : 'Create'}
              </Button>
            </DialogActions>
          </Dialog>
          {/* Search, Filter, View Toggle */}
          <Box display="flex" alignItems="center" gap={2} mb={4} flexWrap="wrap">
            <TextField
              placeholder="Search documents..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              sx={{ width: { xs: '100%', sm: 350 }, bgcolor: '#fff', borderRadius: 2 }}
              InputProps={{
                startAdornment: (
                  <Box component="span" sx={{ color: '#a0aec0', mr: 1 }}><SearchIcon /></Box>
                ),
              }}
            />
            <Button
              variant="outlined"
              onClick={handleFilterClick}
              sx={{ minWidth: 160, borderRadius: 2, textTransform: 'none', fontWeight: 600 }}
              endIcon={<span style={{ fontSize: 18, marginLeft: 4 }}>▼</span>}
            >
              {FILTERS.find(f => f.value === filterBy)?.label}
            </Button>
            <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleFilterClose}>
              {FILTERS.map(f => (
                <MenuItem key={f.value} selected={filterBy === f.value} onClick={() => handleFilterSelect(f.value)}>
                  {f.label}
                </MenuItem>
              ))}
            </Menu>
          </Box>
          {/* Document Grid/List */}
          {loading ? (
            <Box display="flex" justifyContent="center" alignItems="center" minHeight={300}>
              <CircularProgress />
            </Box>
          ) : error ? (
            <Alert severity="error">{error}</Alert>
          ) : (
            <Grid container spacing={3}>
              {filteredDocuments.length === 0 ? (
                <Grid item xs={12}>
                  <Box textAlign="center" py={8}>
                    <DescriptionIcon sx={{ fontSize: 64, mb: 2, color: '#a0aec0' }} />
                    <Typography variant="h6" sx={{ color: '#718096' }}>
                      No documents found
                    </Typography>
                    <Typography variant="body2" sx={{ color: '#a0aec0' }}>
                      Create your first document to get started
                    </Typography>
                  </Box>
                </Grid>
              ) : (
                filteredDocuments.map(doc => (
                  <Grid item xs={12} sm={6} md={4} key={doc._id || doc.id}>
                    <Card sx={{ borderRadius: 3, boxShadow: '0 2px 8px rgba(0,0,0,0.07)', border: '1px solid #e2e8f0', bgcolor: '#fff', height: 180, display: 'flex', flexDirection: 'column', justifyContent: 'center', p: 2 }}>
                      <CardContent sx={{ p: 2 }}>
                        <Box display="flex" alignItems="center" gap={1} mb={1}>
                          <DescriptionIcon sx={{ color: '#2563eb', fontSize: 28 }} />
                          <Typography variant="h6" fontWeight={700} sx={{ color: '#22223b', flex: 1, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                            {doc.title}
                          </Typography>
                          <Chip
                            icon={doc.visibility === 'public' ? <PublicIcon sx={{ fontSize: 18 }} /> : <LockIcon sx={{ fontSize: 18 }} />}
                            label={doc.visibility?.charAt(0).toUpperCase() + doc.visibility?.slice(1)}
                            size="small"
                            sx={{ fontWeight: 600, bgcolor: doc.visibility === 'public' ? '#22223b' : '#e2e8f0', color: doc.visibility === 'public' ? '#fff' : '#22223b', ml: 2 }}
                          />
                        </Box>
                        <Typography variant="body2" sx={{ color: '#718096', mb: 1, mt: 0.5, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: '100%' }}>
                          {doc.content}
                        </Typography>
                        <Box display="flex" alignItems="center" gap={2} mt={1}>
                          <Avatar sx={{ width: 28, height: 28, fontSize: '1rem' }}>{doc.author?.name ? doc.author.name[0] : 'U'}</Avatar>
                          <Typography variant="caption" sx={{ color: '#718096', fontWeight: 500 }}>
                            By {doc.author?.name || 'Unknown'}
                          </Typography>
                          <Typography variant="caption" sx={{ color: '#a0aec0' }}>
                            Modified {doc.updatedAt ? new Date(doc.updatedAt).toLocaleDateString() : doc.lastModified || ''}
                          </Typography>
                          <Box display="flex" alignItems="center" gap={0.5}>
                            <GroupIcon fontSize="small" sx={{ color: '#a0aec0' }} />
                            <Typography variant="caption" sx={{ color: '#a0aec0' }}>
                              {doc.collaborators?.length || doc.collaborators || 1} collaborators
                            </Typography>
                          </Box>
                        </Box>
                      </CardContent>
                    </Card>
                  </Grid>
                ))
              )}
            </Grid>
          )}
        </Box>
      </Box>
    </Box>
  );
};

export default DashboardPage;