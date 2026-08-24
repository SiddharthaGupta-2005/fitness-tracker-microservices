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
  RUNNING: { label: 'RUNNING', emoji: '🏃‍♂️', defaultCalPerMin: 11, color: '#b4ff00', intensity: 'HIGH' },
  WALKING: { label: 'WALKING', emoji: '🚶‍♂️', defaultCalPerMin: 4.5, color: '#00d4ff', intensity: 'LOW' },
  STRENGTH_TRAINING: { label: 'STRENGTH TRAINING', emoji: '🏋️‍♂️', defaultCalPerMin: 8, color: '#ff4d00', intensity: 'HIGH' },
  POWER_LIFTING: { label: 'POWERLIFTING', emoji: '🦾', defaultCalPerMin: 9, color: '#ff4d00', intensity: 'HIGH' },
  SWIMMING: { label: 'SWIMMING', emoji: '🏊‍♂️', defaultCalPerMin: 10, color: '#00d4ff', intensity: 'MED' },
  CYCLING: { label: 'CYCLING', emoji: '🚴‍♂️', defaultCalPerMin: 9.5, color: '#b4ff00', intensity: 'MED' },
  CARDIO: { label: 'CARDIO HIIT', emoji: '⚡', defaultCalPerMin: 10, color: '#ff4d00', intensity: 'HIGH' },
  YOGA: { label: 'YOGA FLOW', emoji: '🧘‍♀️', defaultCalPerMin: 5, color: '#a855f7', intensity: 'LOW' },
  PILATES: { label: 'PILATES', emoji: '🤸‍♀️', defaultCalPerMin: 6, color: '#a855f7', intensity: 'LOW' },
  OTHER: { label: 'GENERAL WORKOUT', emoji: '🔥', defaultCalPerMin: 7, color: '#fbbf24', intensity: 'MED' },
};

const PRESETS = [
  { type: 'RUNNING', duration: 30, calories: 330, label: '🏃‍♂️ 30M RUN' },
  { type: 'STRENGTH_TRAINING', duration: 45, calories: 360, label: '🏋️ 45M GYM' },
  { type: 'CYCLING', duration: 40, calories: 380, label: '🚴 40M RIDE' },
  { type: 'CARDIO', duration: 25, calories: 250, label: '⚡ 25M HIIT' },
  { type: 'SWIMMING', duration: 30, calories: 300, label: '🏊 30M SWIM' },
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
      // Format as clean ISO local date-time string YYYY-MM-DDTHH:mm:ss
      const now = new Date();
      const pad = (n) => String(n).padStart(2, '0');
      const formattedStartTime = `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}T${pad(now.getHours())}:${pad(now.getMinutes())}:${pad(now.getSeconds())}`;

      await addActivity({
        userId: userId,
        type: activity.type,
        duration: Number(activity.duration),
        caloriesBurned: Number(activity.caloriesBurned),
        startTime: formattedStartTime,
        additionalMetrics: {}
      });

      setSuccessMsg(`WORKOUT LOGGED! OPENROUTER AI IS PROCESSING YOUR ${activity.type} SESSION.`);
      setActivity({ type: 'RUNNING', duration: '', caloriesBurned: '', additionalMetrics: {} });
      
      if (onActivitiesAdded) {
        onActivitiesAdded();
      }

      setTimeout(() => setSuccessMsg(''), 6000);
    } catch (error) {
      console.error('Error adding activity:', error);
      const serverMsg = error.response?.data?.message || error.response?.data?.error;
      setErrorMsg(serverMsg ? `ERROR: ${serverMsg}` : 'FAILED TO LOG ACTIVITY. PLEASE CHECK ACTIVITY SERVICE.');
    } finally {
      setLoading(false);
    }
  };

  const currentConfig = ACTIVITY_CONFIG[activity.type] || ACTIVITY_CONFIG.RUNNING;

  return (
    <Card 
      sx={{ 
        mb: 4, 
        backgroundColor: '#13131a', 
        border: '1px solid rgba(255, 255, 255, 0.07)',
        borderRadius: '14px',
        overflow: 'hidden'
      }}
    >
      {/* Header Bar */}
      <Box 
        sx={{ 
          px: 3.5, 
          py: 2.5, 
          background: 'linear-gradient(90deg, rgba(180, 255, 0, 0.08) 0%, rgba(19, 19, 26, 0.95) 100%)',
          borderBottom: '1px solid rgba(255, 255, 255, 0.07)',
          display: 'flex',
          flexDirection: { xs: 'column', sm: 'row' },
          justifyContent: 'space-between',
          alignItems: { xs: 'flex-start', sm: 'center' },
          gap: 1.5
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
          <Box 
            sx={{ 
              width: 32, 
              height: 32, 
              borderRadius: '6px', 
              backgroundColor: '#b4ff00', 
              color: '#0c0c0f',
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center', 
              fontWeight: 900,
              fontSize: '16px' 
            }}
          >
            +
          </Box>
          <Box>
            <Typography 
              variant="h5" 
              sx={{ 
                fontFamily: '"Barlow Condensed", sans-serif',
                fontWeight: 800, 
                color: '#f4f4f7',
                letterSpacing: '0.04em',
                lineHeight: 1
              }}
            >
              LOG NEW WORKOUT TELEMETRY
            </Typography>
            <Typography 
              variant="caption" 
              sx={{ 
                fontFamily: '"JetBrains Mono", monospace',
                color: '#8888a0', 
                fontSize: '0.7rem' 
              }}
            >
              REAL-TIME EVENT STREAM PUBLISHING
            </Typography>
          </Box>
        </Box>

        {/* Quick Presets */}
        <Stack direction="row" spacing={1} sx={{ flexWrap: 'wrap', gap: 0.8 }}>
          {PRESETS.map((p, i) => (
            <Chip 
              key={i}
              label={p.label}
              size="small"
              onClick={() => handlePresetSelect(p)}
              sx={{ 
                fontFamily: '"JetBrains Mono", monospace',
                fontSize: '0.72rem',
                fontWeight: 700,
                backgroundColor: 'rgba(255, 255, 255, 0.03)',
                color: '#f4f4f7',
                border: '1px solid rgba(255, 255, 255, 0.08)',
                cursor: 'pointer',
                '&:hover': {
                  backgroundColor: 'rgba(180, 255, 0, 0.15)',
                  borderColor: '#b4ff00',
                  color: '#b4ff00'
                }
              }}
            />
          ))}
        </Stack>
      </Box>

      <CardContent sx={{ p: 3.5 }}>
        {errorMsg && (
          <Alert 
            severity="error" 
            sx={{ 
              mb: 3, 
              backgroundColor: 'rgba(255, 77, 0, 0.12)', 
              color: '#ff4d00', 
              border: '1px solid rgba(255, 77, 0, 0.3)',
              fontFamily: '"JetBrains Mono", monospace',
              fontSize: '0.85rem'
            }}
          >
            {errorMsg}
          </Alert>
        )}

        {successMsg && (
          <Alert 
            severity="success" 
            sx={{ 
              mb: 3, 
              backgroundColor: 'rgba(180, 255, 0, 0.12)', 
              color: '#b4ff00', 
              border: '1px solid rgba(180, 255, 0, 0.3)',
              fontFamily: '"JetBrains Mono", monospace',
              fontSize: '0.85rem'
            }}
          >
            {successMsg}
          </Alert>
        )}

        <Box component="form" onSubmit={handleSubmit}>
          <Grid container spacing={3}>
            {/* Activity Type Dropdown */}
            <Grid size={{ xs: 12, md: 4 }}>
              <FormControl fullWidth>
                <InputLabel 
                  id="activity-type-label"
                  sx={{ 
                    fontFamily: '"Barlow Condensed", sans-serif',
                    fontWeight: 700,
                    letterSpacing: '0.04em'
                  }}
                >
                  ACTIVITY TYPE
                </InputLabel>
                <Select
                  labelId="activity-type-label"
                  value={activity.type}
                  label="ACTIVITY TYPE"
                  onChange={(e) => setActivity({ ...activity, type: e.target.value })}
                  sx={{ 
                    fontFamily: '"JetBrains Mono", monospace',
                    fontWeight: 600
                  }}
                >
                  {Object.entries(ACTIVITY_CONFIG).map(([key, config]) => (
                    <MenuItem 
                      key={key} 
                      value={key}
                      sx={{ 
                        fontFamily: '"JetBrains Mono", monospace',
                        fontSize: '0.9rem',
                        display: 'flex',
                        justifyContent: 'space-between'
                      }}
                    >
                      <span>{config.emoji} {config.label}</span>
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            {/* Duration Input & Quick Increment Buttons */}
            <Grid size={{ xs: 12, md: 4 }}>
              <Box>
                <TextField
                  fullWidth
                  label="DURATION (MINUTES)"
                  type="number"
                  required
                  value={activity.duration}
                  onChange={(e) => setActivity({ ...activity, duration: e.target.value })}
                  onBlur={handleEstimateCalories}
                  placeholder="e.g. 45"
                  slotProps={{
                    input: {
                      sx: { 
                        fontFamily: '"JetBrains Mono", monospace',
                        fontWeight: 700
                      }
                    },
                    inputLabel: {
                      sx: { 
                        fontFamily: '"Barlow Condensed", sans-serif',
                        fontWeight: 700,
                        letterSpacing: '0.04em'
                      }
                    }
                  }}
                />
                
                {/* Quick Add Minutes */}
                <Box sx={{ display: 'flex', gap: 0.8, mt: 1 }}>
                  {[+5, +15, +30, +45].map((mins) => (
                    <Button
                      key={mins}
                      size="small"
                      variant="outlined"
                      onClick={() => handleAddDuration(mins)}
                      sx={{
                        py: 0.2,
                        px: 1,
                        minWidth: 'auto',
                        fontSize: '0.7rem',
                        fontFamily: '"JetBrains Mono", monospace',
                        borderColor: 'rgba(255, 255, 255, 0.08)',
                        color: '#8888a0',
                        '&:hover': {
                          borderColor: '#b4ff00',
                          color: '#b4ff00',
                          backgroundColor: 'rgba(180, 255, 0, 0.08)'
                        }
                      }}
                    >
                      {mins > 0 ? `+${mins}M` : `${mins}M`}
                    </Button>
                  ))}
                </Box>
              </Box>
            </Grid>

            {/* Calories Burned Input */}
            <Grid size={{ xs: 12, md: 4 }}>
              <Box>
                <TextField
                  fullWidth
                  label="ESTIMATED CALORIES (KCAL)"
                  type="number"
                  required
                  value={activity.caloriesBurned}
                  onChange={(e) => setActivity({ ...activity, caloriesBurned: e.target.value })}
                  placeholder="e.g. 380"
                  slotProps={{
                    input: {
                      sx: { 
                        fontFamily: '"JetBrains Mono", monospace',
                        fontWeight: 700
                      }
                    },
                    inputLabel: {
                      sx: { 
                        fontFamily: '"Barlow Condensed", sans-serif',
                        fontWeight: 700,
                        letterSpacing: '0.04em'
                      }
                    }
                  }}
                />
                <Button
                  size="small"
                  onClick={handleEstimateCalories}
                  sx={{
                    mt: 0.8,
                    p: 0,
                    fontSize: '0.72rem',
                    color: '#b4ff00',
                    fontFamily: '"JetBrains Mono", monospace',
                    fontWeight: 700,
                    textTransform: 'uppercase',
                    '&:hover': {
                      background: 'none',
                      textDecoration: 'underline'
                    }
                  }}
                >
                  ⚡ Auto-Calculate (~{currentConfig.defaultCalPerMin} kcal/min)
                </Button>
              </Box>
            </Grid>

            {/* Submit Action Button */}
            <Grid size={{ xs: 12 }}>
              <Button
                type="submit"
                variant="contained"
                size="large"
                fullWidth
                disabled={loading}
                sx={{
                  py: 1.8,
                  backgroundColor: '#b4ff00',
                  color: '#0c0c0f',
                  fontFamily: '"Barlow Condensed", sans-serif',
                  fontWeight: 900,
                  fontSize: '1.2rem',
                  letterSpacing: '0.05em',
                  borderRadius: '10px',
                  boxShadow: '0 4px 20px rgba(180, 255, 0, 0.3)',
                  transition: 'all 0.2s',
                  '&:hover': {
                    backgroundColor: '#c9ff33',
                    boxShadow: '0 6px 30px rgba(180, 255, 0, 0.5)',
                    transform: 'translateY(-1px)'
                  }
                }}
              >
                {loading ? (
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                    <CircularProgress size={22} sx={{ color: '#0c0c0f' }} />
                    <span>PUBLISHING TO RABBITMQ & OPENROUTER AI...</span>
                  </Box>
                ) : (
                  <span>🚀 LOG WORKOUT & INITIALIZE AI COACHING</span>
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