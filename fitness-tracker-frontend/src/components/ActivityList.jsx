import React, { useState } from 'react';
import { 
  Box, 
  Button, 
  Card, 
  CardActions, 
  CardContent, 
  Grid, 
  Typography, 
  Chip, 
  TextField, 
  Stack, 
  MenuItem, 
  Select, 
  FormControl, 
  InputLabel,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  CircularProgress
} from '@mui/material';
import { useNavigate } from 'react-router';
import { deleteActivity } from '../services/api';

const ACTIVITY_METADATA = {
  RUNNING: { label: 'RUNNING', emoji: '🏃‍♂️', color: '#b4ff00', intensity: 'HIGH', intensityColor: '#ff4d00' },
  WALKING: { label: 'WALKING', emoji: '🚶‍♂️', color: '#00d4ff', intensity: 'LOW', intensityColor: '#00d4ff' },
  STRENGTH_TRAINING: { label: 'STRENGTH TRAINING', emoji: '🏋️‍♂️', color: '#ff4d00', intensity: 'HIGH', intensityColor: '#ff4d00' },
  POWER_LIFTING: { label: 'POWERLIFTING', emoji: '🦾', color: '#ff4d00', intensity: 'HIGH', intensityColor: '#ff4d00' },
  SWIMMING: { label: 'SWIMMING', emoji: '🏊‍♂️', color: '#00d4ff', intensity: 'MED', intensityColor: '#b4ff00' },
  CYCLING: { label: 'CYCLING', emoji: '🚴‍♂️', color: '#b4ff00', intensity: 'MED', intensityColor: '#b4ff00' },
  CARDIO: { label: 'CARDIO HIIT', emoji: '⚡', color: '#ff4d00', intensity: 'HIGH', intensityColor: '#ff4d00' },
  YOGA: { label: 'YOGA FLOW', emoji: '🧘‍♀️', color: '#a855f7', intensity: 'LOW', intensityColor: '#00d4ff' },
  PILATES: { label: 'PILATES', emoji: '🤸‍♀️', color: '#a855f7', intensity: 'LOW', intensityColor: '#00d4ff' },
  OTHER: { label: 'GENERAL WORKOUT', emoji: '🔥', color: '#fbbf24', intensity: 'MED', intensityColor: '#b4ff00' },
};

const ActivityList = ({ activities = [], onActivityDeleted }) => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState('ALL');
  const [sortBy, setSortBy] = useState('NEWEST');
  
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedActivityId, setSelectedActivityId] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const openDeleteDialog = (e, id) => {
    e.stopPropagation();
    setSelectedActivityId(id);
    setDeleteDialogOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!selectedActivityId) return;
    setDeleting(true);
    try {
      await deleteActivity(selectedActivityId);
      if (onActivityDeleted) {
        onActivityDeleted(selectedActivityId);
      }
    } catch (error) {
      console.error('Failed to delete activity:', error);
    } finally {
      setDeleting(false);
      setDeleteDialogOpen(false);
      setSelectedActivityId(null);
    }
  };

  // Filter & Search Logic
  const filteredActivities = activities
    .filter((act) => {
      const matchesType = filterType === 'ALL' || act.type === filterType;
      const meta = ACTIVITY_METADATA[act.type] || ACTIVITY_METADATA.OTHER;
      const matchesSearch = 
        act.type.toLowerCase().includes(searchQuery.toLowerCase()) ||
        meta.label.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (act.duration && act.duration.toString().includes(searchQuery)) ||
        ((act.calories || act.caloriesBurned) && (act.calories || act.caloriesBurned).toString().includes(searchQuery));
      return matchesType && matchesSearch;
    })
    .sort((a, b) => {
      if (sortBy === 'CALORIES_DESC') {
        const calA = Number(a.calories || a.caloriesBurned) || 0;
        const calB = Number(b.calories || b.caloriesBurned) || 0;
        return calB - calA;
      }
      if (sortBy === 'DURATION_DESC') {
        return (Number(b.duration) || 0) - (Number(a.duration) || 0);
      }
      return (b.id || '').localeCompare(a.id || '');
    });

  const formatDate = (isoString) => {
    if (!isoString) return 'RECENT';
    try {
      const date = new Date(isoString);
      return date.toLocaleDateString(undefined, { 
        month: 'short', 
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      }).toUpperCase();
    } catch {
      return 'RECENT';
    }
  };

  return (
    <Box>
      {/* Feed Title & Search Bar */}
      <Box sx={{ mb: 3.5 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2, flexWrap: 'wrap', gap: 1 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
            <Typography 
              variant="h4" 
              sx={{ 
                fontFamily: '"Barlow Condensed", sans-serif',
                fontWeight: 900, 
                color: '#f4f4f7',
                letterSpacing: '0.04em'
              }}
            >
              ATHLETIC ACTIVITY STREAM
            </Typography>
            <Chip 
              label={`${filteredActivities.length} SESSIONS`} 
              size="small" 
              sx={{ 
                fontFamily: '"JetBrains Mono", monospace',
                fontWeight: 700, 
                fontSize: '0.75rem',
                backgroundColor: 'rgba(180, 255, 0, 0.12)', 
                color: '#b4ff00',
                border: '1px solid rgba(180, 255, 0, 0.3)'
              }} 
            />
          </Box>

          {/* Sort Dropdown */}
          <FormControl size="small" sx={{ minWidth: 170 }}>
            <InputLabel id="sort-select-label" sx={{ fontFamily: '"Barlow Condensed", sans-serif', fontWeight: 700 }}>
              SORT TELEMETRY
            </InputLabel>
            <Select
              labelId="sort-select-label"
              value={sortBy}
              label="SORT TELEMETRY"
              onChange={(e) => setSortBy(e.target.value)}
              sx={{ fontFamily: '"JetBrains Mono", monospace', fontSize: '0.82rem' }}
            >
              <MenuItem value="NEWEST" sx={{ fontFamily: '"JetBrains Mono", monospace' }}>LATEST SESSIONS</MenuItem>
              <MenuItem value="CALORIES_DESC" sx={{ fontFamily: '"JetBrains Mono", monospace' }}>HIGHEST CALORIES</MenuItem>
              <MenuItem value="DURATION_DESC" sx={{ fontFamily: '"JetBrains Mono", monospace' }}>LONGEST DURATION</MenuItem>
            </Select>
          </FormControl>
        </Box>

        {/* Filter Pills and Search */}
        <Grid container spacing={2} sx={{ alignItems: 'center' }}>
          <Grid size={{ xs: 12, md: 5 }}>
            <TextField
              fullWidth
              size="small"
              placeholder="SEARCH WORKOUTS, CALORIES, DURATION..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              slotProps={{
                input: {
                  sx: { 
                    fontFamily: '"JetBrains Mono", monospace', 
                    fontSize: '0.85rem' 
                  }
                }
              }}
            />
          </Grid>
          <Grid size={{ xs: 12, md: 7 }}>
            <Stack direction="row" spacing={1} sx={{ overflowX: 'auto', pb: 0.5 }}>
              {['ALL', 'RUNNING', 'STRENGTH_TRAINING', 'CYCLING', 'SWIMMING', 'CARDIO'].map((type) => {
                const isSelected = filterType === type;
                return (
                  <Chip
                    key={type}
                    label={type === 'ALL' ? 'ALL SESSIONS' : type.replace('_', ' ')}
                    onClick={() => setFilterType(type)}
                    sx={{
                      fontFamily: '"Barlow Condensed", sans-serif',
                      fontWeight: 800,
                      letterSpacing: '0.04em',
                      fontSize: '0.85rem',
                      px: 0.5,
                      backgroundColor: isSelected ? '#b4ff00' : '#13131a',
                      color: isSelected ? '#0c0c0f' : '#8888a0',
                      border: isSelected ? '1px solid #b4ff00' : '1px solid rgba(255, 255, 255, 0.08)',
                      cursor: 'pointer',
                      '&:hover': {
                        backgroundColor: isSelected ? '#c9ff33' : 'rgba(255, 255, 255, 0.05)',
                        color: isSelected ? '#0c0c0f' : '#f4f4f7'
                      }
                    }}
                  />
                );
              })}
            </Stack>
          </Grid>
        </Grid>
      </Box>

      {/* Empty State */}
      {filteredActivities.length === 0 ? (
        <Card 
          sx={{ 
            p: 6, 
            textAlign: 'center', 
            backgroundColor: '#13131a', 
            border: '1px dashed rgba(255, 255, 255, 0.1)' 
          }}
        >
          <Typography variant="h1" sx={{ fontSize: '3rem', mb: 1 }}>⚡</Typography>
          <Typography variant="h5" sx={{ fontFamily: '"Barlow Condensed", sans-serif', fontWeight: 800, color: '#f4f4f7' }}>
            NO WORKOUT SESSIONS FOUND
          </Typography>
          <Typography variant="body2" sx={{ color: '#8888a0', mt: 1, maxWidth: 400, mx: 'auto' }}>
            Use the logger above or pick a quick workout preset to publish your first event stream to RabbitMQ and OpenRouter AI.
          </Typography>
        </Card>
      ) : (
        /* Activity Grid */
        <Grid container spacing={2.5}>
          {filteredActivities.map((act) => {
            const meta = ACTIVITY_METADATA[act.type] || ACTIVITY_METADATA.OTHER;
            const calories = act.calories || act.caloriesBurned || 0;

            return (
              <Grid size={{ xs: 12, sm: 6, md: 4 }} key={act.id}>
                <Card
                  onClick={() => navigate(`/activities/${act.id}`)}
                  sx={{
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    backgroundColor: '#13131a',
                    border: '1px solid rgba(255, 255, 255, 0.07)',
                    borderRadius: '12px',
                    cursor: 'pointer',
                    position: 'relative',
                    overflow: 'hidden',
                    transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
                    '&:hover': {
                      borderColor: 'rgba(180, 255, 0, 0.4)',
                      transform: 'translateY(-3px)',
                      boxShadow: '0 12px 30px rgba(0, 0, 0, 0.6), 0 0 20px rgba(180, 255, 0, 0.1)'
                    }
                  }}
                >
                  {/* Intensity Indicator Bar */}
                  <Box sx={{ height: 3, backgroundColor: meta.intensityColor, width: '100%' }} />

                  <CardContent sx={{ p: 2.8, pb: 1 }}>
                    {/* Header: Type & Intensity Chip */}
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Typography sx={{ fontSize: '1.4rem' }}>{meta.emoji}</Typography>
                        <Typography 
                          variant="h6" 
                          sx={{ 
                            fontFamily: '"Barlow Condensed", sans-serif',
                            fontWeight: 800, 
                            color: '#f4f4f7',
                            letterSpacing: '0.03em'
                          }}
                        >
                          {meta.label}
                        </Typography>
                      </Box>

                      <Chip 
                        label={`${meta.intensity} INTENSITY`} 
                        size="small" 
                        sx={{ 
                          fontFamily: '"JetBrains Mono", monospace',
                          fontSize: '0.65rem', 
                          fontWeight: 800,
                          backgroundColor: `${meta.intensityColor}18`,
                          color: meta.intensityColor,
                          border: `1px solid ${meta.intensityColor}40`
                        }} 
                      />
                    </Box>

                    {/* Metrics Grid */}
                    <Grid container spacing={1.5} sx={{ my: 1.5 }}>
                      <Grid size={{ xs: 6 }}>
                        <Box sx={{ p: 1.5, borderRadius: '8px', backgroundColor: 'rgba(255, 255, 255, 0.02)', border: '1px solid rgba(255, 255, 255, 0.05)' }}>
                          <Typography variant="caption" sx={{ fontFamily: '"Barlow Condensed", sans-serif', color: '#8888a0', fontWeight: 800 }}>
                            DURATION
                          </Typography>
                          <Typography variant="h5" sx={{ fontFamily: '"JetBrains Mono", monospace', fontWeight: 800, color: '#00d4ff', mt: 0.2 }}>
                            {act.duration || 0} <span style={{ fontSize: '0.75rem', fontWeight: 600 }}>MIN</span>
                          </Typography>
                        </Box>
                      </Grid>

                      <Grid size={{ xs: 6 }}>
                        <Box sx={{ p: 1.5, borderRadius: '8px', backgroundColor: 'rgba(255, 255, 255, 0.02)', border: '1px solid rgba(255, 255, 255, 0.05)' }}>
                          <Typography variant="caption" sx={{ fontFamily: '"Barlow Condensed", sans-serif', color: '#8888a0', fontWeight: 800 }}>
                            CALORIES
                          </Typography>
                          <Typography variant="h5" sx={{ fontFamily: '"JetBrains Mono", monospace', fontWeight: 800, color: '#ff4d00', mt: 0.2 }}>
                            {calories} <span style={{ fontSize: '0.75rem', fontWeight: 600 }}>KCAL</span>
                          </Typography>
                        </Box>
                      </Grid>
                    </Grid>

                    {/* Timestamp & Pace Rate */}
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 1.5 }}>
                      <Typography variant="caption" sx={{ fontFamily: '"JetBrains Mono", monospace', color: '#8888a0', fontSize: '0.7rem' }}>
                        {formatDate(act.startTime || act.CreatedAt)}
                      </Typography>
                      <Typography variant="caption" sx={{ fontFamily: '"JetBrains Mono", monospace', color: '#b4ff00', fontWeight: 700, fontSize: '0.7rem' }}>
                        ~{act.duration > 0 ? (calories / act.duration).toFixed(1) : 0} KCAL/MIN
                      </Typography>
                    </Box>
                  </CardContent>

                  {/* Actions Bar */}
                  <CardActions sx={{ px: 2.8, pb: 2.2, pt: 0, justifyContent: 'space-between' }}>
                    <Button 
                      size="small" 
                      variant="outlined"
                      sx={{ 
                        fontFamily: '"Barlow Condensed", sans-serif',
                        fontWeight: 800,
                        fontSize: '0.85rem',
                        letterSpacing: '0.04em',
                        color: '#b4ff00',
                        borderColor: 'rgba(180, 255, 0, 0.3)',
                        '&:hover': {
                          borderColor: '#b4ff00',
                          backgroundColor: 'rgba(180, 255, 0, 0.1)',
                          boxShadow: '0 0 15px rgba(180, 255, 0, 0.25)'
                        }
                      }}
                    >
                      ⚡ VIEW AI REPORT
                    </Button>

                    <Button 
                      size="small"
                      onClick={(e) => openDeleteDialog(e, act.id)}
                      sx={{ 
                        fontFamily: '"JetBrains Mono", monospace',
                        fontSize: '0.75rem',
                        color: '#8888a0',
                        minWidth: 'auto',
                        p: 0.8,
                        '&:hover': {
                          color: '#ff4d00',
                          backgroundColor: 'rgba(255, 77, 0, 0.1)'
                        }
                      }}
                    >
                      DELETE
                    </Button>
                  </CardActions>
                </Card>
              </Grid>
            );
          })}
        </Grid>
      )}

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
        PaperProps={{
          sx: {
            backgroundColor: '#13131a',
            border: '1px solid rgba(255, 255, 255, 0.09)',
            borderRadius: '14px',
            p: 1
          }
        }}
      >
        <DialogTitle sx={{ fontFamily: '"Barlow Condensed", sans-serif', fontWeight: 800, color: '#f4f4f7', fontSize: '1.3rem' }}>
          CONFIRM SESSION DELETION
        </DialogTitle>
        <DialogContent>
          <DialogContentText sx={{ color: '#8888a0', fontFamily: '"DM Sans", sans-serif' }}>
            Are you sure you want to delete this workout session from your telemetry log? This action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions sx={{ p: 2, pt: 0 }}>
          <Button 
            onClick={() => setDeleteDialogOpen(false)} 
            sx={{ color: '#8888a0', fontFamily: '"Barlow Condensed", sans-serif', fontWeight: 700 }}
          >
            CANCEL
          </Button>
          <Button 
            onClick={handleConfirmDelete} 
            variant="contained" 
            color="secondary"
            disabled={deleting}
            sx={{
              fontFamily: '"Barlow Condensed", sans-serif',
              fontWeight: 800,
              backgroundColor: '#ff4d00',
              '&:hover': { backgroundColor: '#ff6622' }
            }}
          >
            {deleting ? <CircularProgress size={18} color="inherit" /> : 'CONFIRM DELETE'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default ActivityList;
