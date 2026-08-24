import React, { useState } from 'react';
import { 
  Box, 
  Button, 
  Card, 
  CardContent, 
  FormControl, 
  Grid, 
  InputLabel, 
  MenuItem, 
  Select, 
  TextField, 
  Typography, 
  Chip, 
  Alert,
  CircularProgress,
  Stack
} from '@mui/material';
import { addActivity } from '../services/api';

const ACTIVITY_CONFIG = {
  RUNNING: { label: 'Running', emoji: '🏃‍♂️', defaultCalPerMin: 11, color: '#10B981' },
  WALKING: { label: 'Walking', emoji: '🚶', defaultCalPerMin: 4.5, color: '#06B6D4' },
  STRENGTH_TRAINING: { label: 'Strength Training', emoji: '🏋️', defaultCalPerMin: 8, color: '#8B5CF6' },
  POWER_LIFTING: { label: 'Power Lifting', emoji: '🏋️‍♂️', defaultCalPerMin: 9, color: '#EC4899' },
  SWIMMING: { label: 'Swimming', emoji: '🏊', defaultCalPerMin: 10, color: '#3B82F6' },
  CYCLING: { label: 'Cycling', emoji: '🚴', defaultCalPerMin: 9.5, color: '#F59E0B' },
  CARDIO: { label: 'Cardio', emoji: '❤️', defaultCalPerMin: 10, color: '#EF4444' },
  YOGA: { label: 'Yoga', emoji: '🧘', defaultCalPerMin: 5, color: '#14B8A6' },
  PILATES: { label: 'Pilates', emoji: '🤸', defaultCalPerMin: 6, color: '#A855F7' },
  OTHER: { label: 'Other', emoji: '⚡', defaultCalPerMin: 7, color: '#6B7280' },
};

const PRESETS = [
  { type: 'RUNNING', duration: 30, calories: 330, label: '🏃‍♂️ 30m Run' },
  { type: 'STRENGTH_TRAINING', duration: 45, calories: 360, label: '🏋️ 45m Gym' },
  { type: 'CYCLING', duration: 40, calories: 380, label: '🚴 40m Ride' },
  { type: 'SWIMMING', duration: 30, calories: 300, label: '🏊 30m Swim' },
  { type: 'YOGA', duration: 25, calories: 125, label: '🧘 25m Yoga' },
];

const ActivityForm = ({ onActivitiesAdded }) => {
  const [activity, setActivity] = useState({
    type: 'RUNNING',
    duration: '',
    caloriesBurned: '',
    additionalMetrics: {},
  });

  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const handlePresetSelect = (preset) => {
    setActivity({
      type: preset.type,
      duration: preset.duration.toString(),
      caloriesBurned: preset.calories.toString(),
      additionalMetrics: {},
    });
  };

  const handleEstimateCalories = () => {
    const dur = Number(activity.duration);
    if (!dur || dur <= 0) return;
    const rate = ACTIVITY_CONFIG[activity.type]?.defaultCalPerMin || 8;
    const estimated = Math.round(dur * rate);
    setActivity(prev => ({ ...prev, caloriesBurned: estimated.toString() }));
  };

  const handleAddDuration = (mins) => {
    const current = Number(activity.duration) || 0;
    const newDur = current + mins;
    const rate = ACTIVITY_CONFIG[activity.type]?.defaultCalPerMin || 8;
    setActivity(prev => ({
      ...prev,
      duration: newDur.toString(),
      caloriesBurned: Math.round(newDur * rate).toString()
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setSuccessMsg('');
    setErrorMsg('');

    try {
      const userId = localStorage.getItem('userId') || 'athlete-user';
      await addActivity({
        ...activity,
        userId: userId,
        duration: Number(activity.duration),
        caloriesBurned: Number(activity.caloriesBurned),
        startTime: new Date().toISOString()
      });

      setSuccessMsg(`Workout logged! AI Coach is now analyzing your ${ACTIVITY_CONFIG[activity.type]?.label || 'workout'} session.`);
      setActivity({ type: 'RUNNING', duration: '', caloriesBurned: '', additionalMetrics: {} });
      
      if (onActivitiesAdded) {
        onActivitiesAdded();
      }

      setTimeout(() => setSuccessMsg(''), 6000);
    } catch (error) {
      console.error('Error adding activity:', error);
      const serverMsg = error.response?.data?.message || error.response?.data?.error;
      setErrorMsg(serverMsg ? `Error: ${serverMsg}` : 'Failed to log activity. Please check that Activity Service is running.');
    } finally {
      setLoading(false);
    }
  };

  const currentConfig = ACTIVITY_CONFIG[activity.type] || ACTIVITY_CONFIG.RUNNING;

  return (
    <Card 
      sx={{ 
        mb: 4, 
        border: '1px solid rgba(255, 255, 255, 0.1)',
        background: 'rgba(17, 24, 39, 0.85)',
        boxShadow: '0 12px 40px rgba(0, 0, 0, 0.3)',
      }}
    >
      <CardContent sx={{ p: { xs: 2.5, sm: 3.5 } }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Box>
            <Typography variant="h5" sx={{ fontWeight: 800, color: '#F9FAFB' }}>
              Track New Activity
            </Typography>
            <Typography variant="body2" sx={{ color: '#9CA3AF', mt: 0.2 }}>
              Log your workout metrics to receive AI coaching and recovery insights.
            </Typography>
          </Box>
          <Chip 
            label={currentConfig.label} 
            sx={{ 
              backgroundColor: `${currentConfig.color}20`,
              color: currentConfig.color,
              border: `1px solid ${currentConfig.color}50`,
              fontWeight: 700,
              fontSize: '0.85rem'
            }} 
          />
        </Box>

        {/* Quick Presets */}
        <Box sx={{ mb: 3 }}>
          <Typography variant="caption" sx={{ color: '#6B7280', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            ⚡ Quick 1-Click Presets:
          </Typography>
          <Stack direction="row" spacing={1} sx={{ mt: 1, flexWrap: 'wrap', gap: 1 }}>
            {PRESETS.map((preset, idx) => (
              <Chip
                key={idx}
                label={preset.label}
                clickable
                onClick={() => handlePresetSelect(preset)}
                sx={{
                  backgroundColor: 'rgba(255, 255, 255, 0.05)',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  color: '#E5E7EB',
                  fontWeight: 600,
                  transition: 'all 0.15s ease',
                  '&:hover': {
                    backgroundColor: 'rgba(16, 185, 129, 0.15)',
                    borderColor: '#10B981',
                    color: '#10B981'
                  }
                }}
              />
            ))}
          </Stack>
        </Box>

        {successMsg && (
          <Alert severity="success" sx={{ mb: 2.5, backgroundColor: 'rgba(16, 185, 129, 0.15)', color: '#34D399', border: '1px solid rgba(16, 185, 129, 0.3)' }}>
            🎉 {successMsg}
          </Alert>
        )}

        {errorMsg && (
          <Alert severity="error" sx={{ mb: 2.5, backgroundColor: 'rgba(239, 68, 68, 0.15)', color: '#F87171', border: '1px solid rgba(239, 68, 68, 0.3)' }}>
            {errorMsg}
          </Alert>
        )}

        <Box component="form" onSubmit={handleSubmit}>
          <Grid container spacing={2.5}>
            {/* Activity Type Selection */}
            <Grid size={{ xs: 12, sm: 4 }}>
              <FormControl fullWidth>
                <InputLabel sx={{ color: '#9CA3AF' }}>Activity Type</InputLabel>
                <Select
                  value={activity.type}
                  label="Activity Type"
                  onChange={(e) => setActivity({ ...activity, type: e.target.value })}
                >
                  {Object.entries(ACTIVITY_CONFIG).map(([key, config]) => (
                    <MenuItem key={key} value={key}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                        <span style={{ fontSize: '1.2rem' }}>{config.emoji}</span>
                        <span>{config.label}</span>
                      </Box>
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            {/* Duration */}
            <Grid size={{ xs: 12, sm: 4 }}>
              <Box>
                <TextField
                  fullWidth
                  label="Duration (minutes)"
                  type="number"
                  required
                  placeholder="e.g. 45"
                  value={activity.duration}
                  onChange={(e) => setActivity({ ...activity, duration: e.target.value })}
                  inputProps={{ min: 1, max: 1000 }}
                />
                <Stack direction="row" spacing={0.8} sx={{ mt: 0.8 }}>
                  <Button size="small" variant="text" sx={{ fontSize: '0.75rem', py: 0.2, px: 1, minWidth: 0, color: '#9CA3AF' }} onClick={() => handleAddDuration(15)}>
                    +15m
                  </Button>
                  <Button size="small" variant="text" sx={{ fontSize: '0.75rem', py: 0.2, px: 1, minWidth: 0, color: '#9CA3AF' }} onClick={() => handleAddDuration(30)}>
                    +30m
                  </Button>
                  <Button size="small" variant="text" sx={{ fontSize: '0.75rem', py: 0.2, px: 1, minWidth: 0, color: '#9CA3AF' }} onClick={() => handleAddDuration(45)}>
                    +45m
                  </Button>
                </Stack>
              </Box>
            </Grid>

            {/* Calories Burned */}
            <Grid size={{ xs: 12, sm: 4 }}>
              <Box>
                <TextField
                  fullWidth
                  label="Calories Burned (kcal)"
                  type="number"
                  required
                  placeholder="e.g. 350"
                  value={activity.caloriesBurned}
                  onChange={(e) => setActivity({ ...activity, caloriesBurned: e.target.value })}
                  inputProps={{ min: 1 }}
                />
                <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 0.8 }}>
                  <Button 
                    size="small" 
                    variant="text" 
                    sx={{ fontSize: '0.75rem', py: 0.2, color: '#06B6D4' }}
                    onClick={handleEstimateCalories}
                  >
                    ✨ Auto-Estimate Calories
                  </Button>
                </Box>
              </Box>
            </Grid>

            {/* Submit Button */}
            <Grid size={{ xs: 12 }}>
              <Button
                type="submit"
                variant="contained"
                size="large"
                fullWidth
                disabled={loading || !activity.duration || !activity.caloriesBurned}
                sx={{
                  py: 1.6,
                  fontSize: '1rem',
                  fontWeight: 700,
                  letterSpacing: '0.02em',
                  background: 'linear-gradient(135deg, #10B981 0%, #059669 50%, #06B6D4 100%)',
                }}
              >
                {loading ? (
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                    <CircularProgress size={22} color="inherit" />
                    <span>Publishing to Microservices & AI Coach...</span>
                  </Box>
                ) : (
                  <span>🚀 Log Workout & Generate AI Coaching Report</span>
                )}
              </Button>
            </Grid>
          </Grid>
        </Box>
      </CardContent>
    </Card>
  );
};

export default ActivityForm;