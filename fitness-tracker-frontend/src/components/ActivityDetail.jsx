import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router';
import { 
  Box, 
  Card, 
  CardContent, 
  Typography, 
  Button, 
  Chip, 
  CircularProgress, 
  LinearProgress,
  Stack,
  Grid,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Container
} from '@mui/material';
import { getActivityDetail, deleteActivity } from '../services/api';

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

const ActivityDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [recommendation, setRecommendation] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const pollCountRef = useRef(0);

  const fetchActivityDetail = async (isManual = false) => {
    if (isManual) {
      setIsRefreshing(true);
    }
    try {
      const response = await getActivityDetail(id);
      if (response && response.data) {
        setRecommendation(response.data);
        setIsGenerating(false);
        setLoading(false);
        setIsRefreshing(false);
      }
    } catch (error) {
      if (error.response && error.response.status === 404) {
        if (pollCountRef.current < 15) {
          pollCountRef.current += 1;
          setIsGenerating(true);
          setLoading(false);
          setTimeout(() => fetchActivityDetail(false), 2500);
        } else {
          setIsGenerating(false);
          setLoading(false);
          setIsRefreshing(false);
        }
      } else {
        console.error('Error fetching recommendation:', error);
        setIsGenerating(false);
        setLoading(false);
        setIsRefreshing(false);
      }
    }
  };

  useEffect(() => {
    pollCountRef.current = 0;
    setLoading(true);
    fetchActivityDetail();
  }, [id]);

  const handleManualRefresh = () => {
    pollCountRef.current = 0;
    setIsGenerating(true);
    fetchActivityDetail(true);
  };

  const handleDelete = async () => {
    setDeleting(true);
    try {
      await deleteActivity(id);
      navigate('/activities');
    } catch (error) {
      console.error('Error deleting activity:', error);
    } finally {
      setDeleting(false);
      setDeleteDialogOpen(false);
    }
  };

  const currentType = recommendation?.activityType || 'OTHER';
  const meta = ACTIVITY_METADATA[currentType] || ACTIVITY_METADATA.OTHER;

  return (
    <Box sx={{ py: 4, px: { xs: 2, sm: 3 } }}>
      <Container maxWidth="lg">
        {/* Navigation & Action Bar */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3.5, flexWrap: 'wrap', gap: 1.5 }}>
          <Button
            variant="outlined"
            onClick={() => navigate('/activities')}
            sx={{
              fontFamily: '"Barlow Condensed", sans-serif',
              fontWeight: 800,
              fontSize: '0.95rem',
              letterSpacing: '0.04em',
              borderColor: 'rgba(255, 255, 255, 0.12)',
              color: '#f4f4f7',
              '&:hover': {
                borderColor: '#b4ff00',
                backgroundColor: 'rgba(180, 255, 0, 0.08)'
              }
            }}
          >
            ← BACK TO SESSIONS
          </Button>

          <Box sx={{ display: 'flex', gap: 1.5 }}>
            <Button
              variant="outlined"
              size="small"
              onClick={handleManualRefresh}
              disabled={isRefreshing || isGenerating}
              sx={{
                fontFamily: '"Barlow Condensed", sans-serif',
                fontWeight: 800,
                fontSize: '0.9rem',
                letterSpacing: '0.04em',
                borderColor: 'rgba(180, 255, 0, 0.4)',
                color: '#b4ff00',
                '&:hover': {
                  borderColor: '#b4ff00',
                  backgroundColor: 'rgba(180, 255, 0, 0.1)'
                }
              }}
            >
              {isRefreshing ? 'REFRESHING...' : '🔄 RE-ANALYZE WITH AI'}
            </Button>

            <Button
              variant="outlined"
              size="small"
              onClick={() => setDeleteDialogOpen(true)}
              sx={{
                fontFamily: '"Barlow Condensed", sans-serif',
                fontWeight: 800,
                fontSize: '0.9rem',
                letterSpacing: '0.04em',
                borderColor: 'rgba(255, 77, 0, 0.3)',
                color: '#ff4d00',
                '&:hover': {
                  borderColor: '#ff4d00',
                  backgroundColor: 'rgba(255, 77, 0, 0.1)'
                }
              }}
            >
              DELETE SESSION
            </Button>
          </Box>
        </Box>

        {/* Loading / Generating State */}
        {loading ? (
          <Card sx={{ p: 6, textAlign: 'center', backgroundColor: '#13131a', border: '1px solid rgba(255, 255, 255, 0.07)' }}>
            <CircularProgress size={45} sx={{ color: '#b4ff00', mb: 2 }} />
            <Typography variant="h5" sx={{ fontFamily: '"Barlow Condensed", sans-serif', fontWeight: 800, color: '#f4f4f7' }}>
              FETCHING WORKOUT TELEMETRY...
            </Typography>
          </Card>
        ) : isGenerating ? (
          <Card sx={{ p: 5, textAlign: 'center', backgroundColor: '#13131a', border: '1px solid rgba(180, 255, 0, 0.3)', mb: 3 }}>
            <LinearProgress sx={{ mb: 3, backgroundColor: 'rgba(180, 255, 0, 0.15)', '& .MuiLinearProgress-bar': { backgroundColor: '#b4ff00' } }} />
            <Typography variant="h4" sx={{ fontFamily: '"Barlow Condensed", sans-serif', fontWeight: 800, color: '#b4ff00' }}>
              🤖 OPENROUTER AI COACH IN PROGRESS
            </Typography>
            <Typography variant="body2" sx={{ color: '#8888a0', mt: 1, fontFamily: '"JetBrains Mono", monospace' }}>
              Consuming RabbitMQ event stream & synthesizing biomechanical telemetry...
            </Typography>
          </Card>
        ) : !recommendation ? (
          <Card sx={{ p: 6, textAlign: 'center', backgroundColor: '#13131a', border: '1px dashed rgba(255, 255, 255, 0.1)' }}>
            <Typography variant="h1" sx={{ fontSize: '3rem', mb: 1 }}>⏱️</Typography>
            <Typography variant="h5" sx={{ fontFamily: '"Barlow Condensed", sans-serif', fontWeight: 800, color: '#f4f4f7' }}>
              AI COACH REPORT NOT YET READY
            </Typography>
            <Typography variant="body2" sx={{ color: '#8888a0', mt: 1, mb: 3, maxWidth: 500, mx: 'auto' }}>
              The AI service is either processing your telemetry or awaiting queue pickup.
            </Typography>
            <Button
              variant="contained"
              onClick={handleManualRefresh}
              sx={{
                fontFamily: '"Barlow Condensed", sans-serif',
                fontWeight: 900,
                backgroundColor: '#b4ff00',
                color: '#0c0c0f',
                px: 3,
                py: 1.2
              }}
            >
              ⚡ GENERATE AI COACHING REPORT NOW
            </Button>
          </Card>
        ) : (
          /* Main AI Coaching Report Dashboard */
          <Stack spacing={3}>
            {/* Header Hero Card */}
            <Card
              sx={{
                backgroundColor: '#13131a',
                border: '1px solid rgba(255, 255, 255, 0.07)',
                borderRadius: '14px',
                overflow: 'hidden',
                position: 'relative'
              }}
            >
              <Box sx={{ height: 4, background: 'linear-gradient(90deg, #b4ff00 0%, #00d4ff 50%, #ff4d00 100%)' }} />

              <CardContent sx={{ p: 4 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 2 }}>
                  <Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 1 }}>
                      <Typography sx={{ fontSize: '2rem' }}>{meta.emoji}</Typography>
                      <Typography
                        variant="h3"
                        sx={{
                          fontFamily: '"Barlow Condensed", sans-serif',
                          fontWeight: 900,
                          color: '#f4f4f7',
                          letterSpacing: '0.04em',
                          lineHeight: 1
                        }}
                      >
                        {meta.label} PERFORMANCE REPORT
                      </Typography>
                    </Box>

                    <Typography
                      variant="caption"
                      sx={{
                        fontFamily: '"JetBrains Mono", monospace',
                        color: '#8888a0',
                        fontSize: '0.75rem',
                        display: 'block'
                      }}
                    >
                      SESSION ID: <span style={{ color: '#00d4ff' }}>{id}</span> • AI REPORT ID: <span style={{ color: '#b4ff00' }}>{recommendation.id}</span>
                    </Typography>
                  </Box>

                  <Chip
                    label="⚡ OPENROUTER AI VERIFIED"
                    sx={{
                      fontFamily: '"JetBrains Mono", monospace',
                      fontWeight: 800,
                      fontSize: '0.75rem',
                      backgroundColor: 'rgba(180, 255, 0, 0.12)',
                      color: '#b4ff00',
                      border: '1px solid rgba(180, 255, 0, 0.3)'
                    }}
                  />
                </Box>
              </CardContent>
            </Card>

            {/* AI Executive Summary Card */}
            <Card
              sx={{
                backgroundColor: '#13131a',
                border: '1px solid rgba(180, 255, 0, 0.3)',
                boxShadow: '0 0 30px rgba(180, 255, 0, 0.08)',
                borderRadius: '14px',
                p: 3.5
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.2, mb: 2 }}>
                <Box sx={{ width: 8, height: 8, borderRadius: '50%', backgroundColor: '#b4ff00', boxShadow: '0 0 10px #b4ff00' }} />
                <Typography
                  variant="h5"
                  sx={{
                    fontFamily: '"Barlow Condensed", sans-serif',
                    fontWeight: 800,
                    color: '#b4ff00',
                    letterSpacing: '0.04em'
                  }}
                >
                  EXECUTIVE COACHING SYNTHESIS
                </Typography>
              </Box>

              <Typography
                variant="body1"
                sx={{
                  color: '#f4f4f7',
                  lineHeight: 1.8,
                  fontSize: '1.05rem',
                  fontFamily: '"DM Sans", sans-serif'
                }}
              >
                {recommendation.recommendation || 'Biomechanical evaluation successfully completed. Review specific focus areas below.'}
              </Typography>
            </Card>

            {/* 3 Kinetic Pillar Cards */}
            <Grid container spacing={3}>
              {/* Focus Areas */}
              <Grid size={{ xs: 12, md: 4 }}>
                <Card
                  sx={{
                    height: '100%',
                    backgroundColor: '#13131a',
                    border: '1px solid rgba(255, 255, 255, 0.07)',
                    borderRadius: '14px',
                    p: 3,
                    transition: 'all 0.2s',
                    '&:hover': { borderColor: '#b4ff00', transform: 'translateY(-2px)' }
                  }}
                >
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2.5 }}>
                    <Typography sx={{ fontSize: '1.4rem' }}>🎯</Typography>
                    <Typography
                      variant="h6"
                      sx={{
                        fontFamily: '"Barlow Condensed", sans-serif',
                        fontWeight: 800,
                        color: '#b4ff00',
                        letterSpacing: '0.04em'
                      }}
                    >
                      OPTIMIZATION & FOCUS AREAS
                    </Typography>
                  </Box>

                  <Stack spacing={1.8}>
                    {(recommendation.improvements || ['Maintain consistent cadence and effort']).map((item, idx) => (
                      <Box key={idx} sx={{ display: 'flex', alignItems: 'flex-start', gap: 1.5 }}>
                        <Box sx={{ color: '#b4ff00', fontWeight: 900, fontFamily: '"JetBrains Mono", monospace', fontSize: '0.9rem', mt: '2px' }}>
                          0{idx + 1}.
                        </Box>
                        <Typography variant="body2" sx={{ color: '#f4f4f7', lineHeight: 1.6 }}>
                          {item}
                        </Typography>
                      </Box>
                    ))}
                  </Stack>
                </Card>
              </Grid>

              {/* Next Workout Suggestions */}
              <Grid size={{ xs: 12, md: 4 }}>
                <Card
                  sx={{
                    height: '100%',
                    backgroundColor: '#13131a',
                    border: '1px solid rgba(255, 255, 255, 0.07)',
                    borderRadius: '14px',
                    p: 3,
                    transition: 'all 0.2s',
                    '&:hover': { borderColor: '#00d4ff', transform: 'translateY(-2px)' }
                  }}
                >
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2.5 }}>
                    <Typography sx={{ fontSize: '1.4rem' }}>🚀</Typography>
                    <Typography
                      variant="h6"
                      sx={{
                        fontFamily: '"Barlow Condensed", sans-serif',
                        fontWeight: 800,
                        color: '#00d4ff',
                        letterSpacing: '0.04em'
                      }}
                    >
                      NEXT SESSION RECOMMENDATIONS
                    </Typography>
                  </Box>

                  <Stack spacing={1.8}>
                    {(recommendation.suggestion || ['Progressive overload with recovery intervals']).map((item, idx) => (
                      <Box key={idx} sx={{ display: 'flex', alignItems: 'flex-start', gap: 1.5 }}>
                        <Box sx={{ color: '#00d4ff', fontWeight: 900, fontFamily: '"JetBrains Mono", monospace', fontSize: '0.9rem', mt: '2px' }}>
                          0{idx + 1}.
                        </Box>
                        <Typography variant="body2" sx={{ color: '#f4f4f7', lineHeight: 1.6 }}>
                          {item}
                        </Typography>
                      </Box>
                    ))}
                  </Stack>
                </Card>
              </Grid>

              {/* Safety & Recovery */}
              <Grid size={{ xs: 12, md: 4 }}>
                <Card
                  sx={{
                    height: '100%',
                    backgroundColor: '#13131a',
                    border: '1px solid rgba(255, 255, 255, 0.07)',
                    borderRadius: '14px',
                    p: 3,
                    transition: 'all 0.2s',
                    '&:hover': { borderColor: '#ff4d00', transform: 'translateY(-2px)' }
                  }}
                >
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2.5 }}>
                    <Typography sx={{ fontSize: '1.4rem' }}>🛡️</Typography>
                    <Typography
                      variant="h6"
                      sx={{
                        fontFamily: '"Barlow Condensed", sans-serif',
                        fontWeight: 800,
                        color: '#ff4d00',
                        letterSpacing: '0.04em'
                      }}
                    >
                      RECOVERY & INJURY PREVENTION
                    </Typography>
                  </Box>

                  <Stack spacing={1.8}>
                    {(recommendation.safety || ['Ensure hydration and adequate post-workout sleep']).map((item, idx) => (
                      <Box key={idx} sx={{ display: 'flex', alignItems: 'flex-start', gap: 1.5 }}>
                        <Box sx={{ color: '#ff4d00', fontWeight: 900, fontFamily: '"JetBrains Mono", monospace', fontSize: '0.9rem', mt: '2px' }}>
                          0{idx + 1}.
                        </Box>
                        <Typography variant="body2" sx={{ color: '#f4f4f7', lineHeight: 1.6 }}>
                          {item}
                        </Typography>
                      </Box>
                    ))}
                  </Stack>
                </Card>
              </Grid>
            </Grid>
          </Stack>
        )}

        {/* Delete Dialog */}
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
              Are you sure you want to permanently delete this workout session and its AI coaching telemetry?
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
              onClick={handleDelete}
              variant="contained"
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
      </Container>
    </Box>
  );
};

export default ActivityDetail;