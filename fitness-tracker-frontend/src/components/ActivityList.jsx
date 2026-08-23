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
  DialogActions
} from '@mui/material';
import { useNavigate } from 'react-router';
import { deleteActivity } from '../services/api';

const ACTIVITY_METADATA = {
  RUNNING: { label: 'Running', emoji: '🏃‍♂️', color: '#10B981', gradient: 'linear-gradient(135deg, rgba(16, 185, 129, 0.2) 0%, rgba(5, 150, 105, 0.05) 100%)' },
  WALKING: { label: 'Walking', emoji: '🚶', color: '#06B6D4', gradient: 'linear-gradient(135deg, rgba(6, 182, 212, 0.2) 0%, rgba(14, 165, 233, 0.05) 100%)' },
  STRENGTH_TRAINING: { label: 'Strength Training', emoji: '🏋️', color: '#8B5CF6', gradient: 'linear-gradient(135deg, rgba(139, 92, 246, 0.2) 0%, rgba(109, 40, 217, 0.05) 100%)' },
  POWER_LIFTING: { label: 'Power Lifting', emoji: '🏋️‍♂️', color: '#EC4899', gradient: 'linear-gradient(135deg, rgba(236, 72, 153, 0.2) 0%, rgba(219, 39, 119, 0.05) 100%)' },
  SWIMMING: { label: 'Swimming', emoji: '🏊', color: '#3B82F6', gradient: 'linear-gradient(135deg, rgba(59, 130, 246, 0.2) 0%, rgba(37, 99, 235, 0.05) 100%)' },
  CYCLING: { label: 'Cycling', emoji: '🚴', color: '#F59E0B', gradient: 'linear-gradient(135deg, rgba(245, 158, 11, 0.2) 0%, rgba(217, 119, 6, 0.05) 100%)' },
  CARDIO: { label: 'Cardio', emoji: '❤️', color: '#EF4444', gradient: 'linear-gradient(135deg, rgba(239, 68, 68, 0.2) 0%, rgba(220, 38, 38, 0.05) 100%)' },
  YOGA: { label: 'Yoga', emoji: '🧘', color: '#14B8A6', gradient: 'linear-gradient(135deg, rgba(20, 184, 166, 0.2) 0%, rgba(13, 148, 136, 0.05) 100%)' },
  PILATES: { label: 'Pilates', emoji: '🤸', color: '#A855F7', gradient: 'linear-gradient(135deg, rgba(168, 85, 247, 0.2) 0%, rgba(147, 51, 234, 0.05) 100%)' },
  OTHER: { label: 'Other Workout', emoji: '⚡', color: '#9CA3AF', gradient: 'linear-gradient(135deg, rgba(156, 163, 175, 0.2) 0%, rgba(107, 114, 128, 0.05) 100%)' },
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
      // Default: Newest first (by startTime or natural list order)
      return (b.id || '').localeCompare(a.id || '');
    });

  const formatDate = (isoString) => {
    if (!isoString) return 'Recent';
    try {
      const date = new Date(isoString);
      return date.toLocaleDateString(undefined, { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
    } catch {
      return 'Recent';
    }
  };

  return (
    <Box sx={{ mt: 4, mb: 8 }}>
      {/* Header & Controls */}
      <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, justifyContent: 'space-between', alignItems: { xs: 'flex-start', md: 'center' }, gap: 2, mb: 3 }}>
        <Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
            <Typography variant="h5" sx={{ fontWeight: 800, color: '#F9FAFB' }}>
              Your Workout History
            </Typography>
            <Chip 
              label={`${filteredActivities.length} logs`} 
              size="small" 
              sx={{ backgroundColor: 'rgba(16, 185, 129, 0.2)', color: '#10B981', fontWeight: 700 }}
            />
          </Box>
          <Typography variant="body2" sx={{ color: '#9CA3AF', mt: 0.3 }}>
            Click any activity card to explore AI performance feedback, pace tips, and recovery advice.
          </Typography>
        </Box>

        {/* Search & Sort */}
        <Stack direction="row" spacing={1.5} sx={{ width: { xs: '100%', md: 'auto' } }}>
          <TextField
            size="small"
            placeholder="🔍 Search workouts..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            sx={{ minWidth: { xs: '100%', sm: 220 } }}
          />
          <FormControl size="small" sx={{ minWidth: 160 }}>
            <InputLabel>Sort By</InputLabel>
            <Select
              value={sortBy}
              label="Sort By"
              onChange={(e) => setSortBy(e.target.value)}
            >
              <MenuItem value="NEWEST">⏱️ Newest First</MenuItem>
              <MenuItem value="CALORIES_DESC">🔥 Highest Calories</MenuItem>
              <MenuItem value="DURATION_DESC">⌛ Longest Duration</MenuItem>
            </Select>
          </FormControl>
        </Stack>
      </Box>

      {/* Filter Category Chips */}
      <Stack direction="row" spacing={1} sx={{ mb: 3, overflowX: 'auto', pb: 1 }}>
        <Chip
          label="All Workouts"
          clickable
          color={filterType === 'ALL' ? 'primary' : 'default'}
          onClick={() => setFilterType('ALL')}
          sx={{ fontWeight: 600 }}
        />
        {Object.entries(ACTIVITY_METADATA).map(([key, meta]) => (
          <Chip
            key={key}
            label={`${meta.emoji} ${meta.label}`}
            clickable
            variant={filterType === key ? 'filled' : 'outlined'}
            onClick={() => setFilterType(key)}
            sx={{
              fontWeight: 600,
              borderColor: filterType === key ? meta.color : 'rgba(255, 255, 255, 0.1)',
              backgroundColor: filterType === key ? `${meta.color}30` : 'transparent',
              color: filterType === key ? meta.color : '#9CA3AF',
              '&:hover': {
                borderColor: meta.color,
                color: meta.color,
              }
            }}
          />
        ))}
      </Stack>

      {/* Activities Grid */}
      {filteredActivities.length === 0 ? (
        <Card sx={{ p: 5, textAlign: 'center', backgroundColor: 'rgba(17, 24, 39, 0.5)' }}>
          <Typography variant="h6" sx={{ color: '#9CA3AF', mb: 1 }}>
            {searchQuery || filterType !== 'ALL' ? 'No matching workouts found' : 'No workouts recorded yet'}
          </Typography>
          <Typography variant="body2" sx={{ color: '#6B7280' }}>
            {searchQuery || filterType !== 'ALL' 
              ? 'Try adjusting your search query or filter tags.' 
              : 'Log your first workout using the form above to trigger AI generation!'}
          </Typography>
        </Card>
      ) : (
        <Grid container spacing={2.5}>
          {filteredActivities.map((activity) => {
            const meta = ACTIVITY_METADATA[activity.type] || ACTIVITY_METADATA.OTHER;
            const calories = activity.calories ?? activity.caloriesBurned ?? 0;
            const calPerMin = activity.duration ? (calories / activity.duration).toFixed(1) : 0;

            return (
              <Grid size={{ xs: 12, sm: 6, md: 4 }} key={activity.id}>
                <Card
                  sx={{
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    cursor: 'pointer',
                    background: meta.gradient,
                    border: `1px solid ${meta.color}40`,
                    boxShadow: '0 8px 24px rgba(0, 0, 0, 0.25)',
                    transition: 'all 0.25s cubic-bezier(0.4, 0, 0.2, 1)',
                    position: 'relative',
                    overflow: 'hidden',
                    '&:hover': {
                      transform: 'translateY(-4px)',
                      boxShadow: `0 14px 35px ${meta.color}30`,
                      borderColor: meta.color,
                    }
                  }}
                  onClick={() => navigate(`/activities/${activity.id}`)}
                >
                  <CardContent sx={{ p: 2.5 }}>
                    {/* Top Header Row */}
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.2 }}>
                        <Box
                          sx={{
                            width: 44,
                            height: 44,
                            borderRadius: '12px',
                            backgroundColor: `${meta.color}25`,
                            border: `1px solid ${meta.color}50`,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontSize: '22px',
                          }}
                        >
                          {meta.emoji}
                        </Box>
                        <Box>
                          <Typography variant="h6" sx={{ fontWeight: 700, color: '#F9FAFB', lineHeight: 1.1 }}>
                            {meta.label}
                          </Typography>
                          <Typography variant="caption" sx={{ color: '#9CA3AF' }}>
                            {formatDate(activity.startTime || activity.CreatedAt)}
                          </Typography>
                        </Box>
                      </Box>

                      <Chip
                        label="AI Ready ✨"
                        size="small"
                        sx={{
                          height: 22,
                          fontSize: '0.7rem',
                          fontWeight: 700,
                          backgroundColor: 'rgba(139, 92, 246, 0.2)',
                          color: '#A78BFA',
                          border: '1px solid rgba(139, 92, 246, 0.4)'
                        }}
                      />
                    </Box>

                    {/* Metrics Grid */}
                    <Grid container spacing={1.5} sx={{ my: 1 }}>
                      <Grid size={{ xs: 6 }}>
                        <Box sx={{ p: 1.2, borderRadius: '10px', backgroundColor: 'rgba(0, 0, 0, 0.25)', border: '1px solid rgba(255, 255, 255, 0.05)' }}>
                          <Typography variant="caption" sx={{ color: '#9CA3AF', display: 'block' }}>
                            ⏱️ Duration
                          </Typography>
                          <Typography variant="body1" sx={{ fontWeight: 700, color: '#F9FAFB' }}>
                            {activity.duration} <span style={{ fontSize: '0.8rem', color: '#9CA3AF' }}>mins</span>
                          </Typography>
                        </Box>
                      </Grid>

                      <Grid size={{ xs: 6 }}>
                        <Box sx={{ p: 1.2, borderRadius: '10px', backgroundColor: 'rgba(0, 0, 0, 0.25)', border: '1px solid rgba(255, 255, 255, 0.05)' }}>
                          <Typography variant="caption" sx={{ color: '#9CA3AF', display: 'block' }}>
                            🔥 Calories
                          </Typography>
                          <Typography variant="body1" sx={{ fontWeight: 700, color: '#F9FAFB' }}>
                            {calories} <span style={{ fontSize: '0.8rem', color: '#9CA3AF' }}>kcal</span>
                          </Typography>
                        </Box>
                      </Grid>
                    </Grid>

                    <Typography variant="caption" sx={{ color: '#6B7280', display: 'block', mt: 1 }}>
                      Intensity: ~{calPerMin} kcal / min
                    </Typography>
                  </CardContent>

                  {/* Actions Footer */}
                  <CardActions sx={{ px: 2.5, pb: 2, pt: 0, justifyContent: 'space-between', borderTop: '1px solid rgba(255, 255, 255, 0.05)' }}>
                    <Button
                      size="small"
                      variant="text"
                      sx={{ color: meta.color, fontWeight: 700, p: 0 }}
                      onClick={() => navigate(`/activities/${activity.id}`)}
                    >
                      Explore AI Coach →
                    </Button>
                    <Button
                      size="small"
                      variant="text"
                      color="error"
                      sx={{ opacity: 0.7, '&:hover': { opacity: 1 } }}
                      onClick={(e) => openDeleteDialog(e, activity.id)}
                    >
                      🗑️ Delete
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
            backgroundColor: '#111827',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            borderRadius: 3,
            p: 1
          }
        }}
      >
        <DialogTitle sx={{ fontWeight: 700, color: '#F9FAFB' }}>
          Delete Activity?
        </DialogTitle>
        <DialogContent>
          <DialogContentText sx={{ color: '#9CA3AF' }}>
            Are you sure you want to delete this workout log? This action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions sx={{ pb: 2, px: 3 }}>
          <Button onClick={() => setDeleteDialogOpen(false)} sx={{ color: '#9CA3AF' }}>
            Cancel
          </Button>
          <Button 
            variant="contained" 
            color="error" 
            onClick={handleConfirmDelete}
            disabled={deleting}
          >
            {deleting ? 'Deleting...' : 'Confirm Delete'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default ActivityList;
