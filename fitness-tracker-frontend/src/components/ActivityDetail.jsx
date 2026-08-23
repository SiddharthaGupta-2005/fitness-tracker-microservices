import React, { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router';
import { getActivityDetail, deleteActivity } from '../services/api';
import { 
  Typography, 
  Card, 
  CardContent, 
  Box, 
  Button, 
  CircularProgress, 
  Alert, 
  Grid, 
  Chip, 
  Divider, 
  Paper,
  LinearProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Stack
} from '@mui/material';

const ACTIVITY_METADATA = {
  RUNNING: { label: 'Running', emoji: '🏃‍♂️', color: '#10B981' },
  WALKING: { label: 'Walking', emoji: '🚶', color: '#06B6D4' },
  STRENGTH_TRAINING: { label: 'Strength Training', emoji: '🏋️', color: '#8B5CF6' },
  POWER_LIFTING: { label: 'Power Lifting', emoji: '🏋️‍♂️', color: '#EC4899' },
  SWIMMING: { label: 'Swimming', emoji: '🏊', color: '#3B82F6' },
  CYCLING: { label: 'Cycling', emoji: '🚴', color: '#F59E0B' },
  CARDIO: { label: 'Cardio', emoji: '❤️', color: '#EF4444' },
  YOGA: { label: 'Yoga', emoji: '🧘', color: '#14B8A6' },
  PILATES: { label: 'Pilates', emoji: '🤸', color: '#A855F7' },
  OTHER: { label: 'Workout', emoji: '⚡', color: '#9CA3AF' },
};

const ActivityDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [recommendation, setRecommendation] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isGenerating, setIsGenerating] = useState(true);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const pollCountRef = useRef(0);

  const fetchActivityDetail = async () => {
    try {
      const response = await getActivityDetail(id);
      setRecommendation(response.data);
      setIsGenerating(false);
      setLoading(false);
    } catch (error) {
      if (error.response && error.response.status === 404) {
        if (pollCountRef.current < 25) {
          pollCountRef.current += 1;
          setIsGenerating(true);
          setLoading(false);
          setTimeout(fetchActivityDetail, 2000);
        } else {
          setIsGenerating(false);
          setLoading(false);
        }
      } else {
        console.error('Error fetching recommendation:', error);
        setIsGenerating(false);
        setLoading(false);
      }
    }
  };

  useEffect(() => {
    pollCountRef.current = 0;
    fetchActivityDetail();
  }, [id]);

  const handleManualRefresh = () => {
    setLoading(true);
    pollCountRef.current = 0;
    fetchActivityDetail();
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

  const currentMeta = ACTIVITY_METADATA[recommendation?.activityType] || ACTIVITY_METADATA.OTHER;

  if (loading) {
    return (
      <Box sx={{ py: 10, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
        <CircularProgress size={48} sx={{ color: '#10B981' }} />
        <Typography variant="h6" sx={{ color: '#F9FAFB', fontWeight: 600 }}>
          Retrieving AI Coaching Report...
        </Typography>
        <Typography variant="body2" sx={{ color: '#9CA3AF' }}>
          Connecting to AI Microservice via API Gateway...
        </Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ maxWidth: 960, mx: 'auto', py: 3, px: { xs: 2, sm: 3 } }}>
      {/* Top Action Bar */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Button 
          variant="outlined" 
          onClick={() => navigate('/activities')}
          sx={{ borderColor: 'rgba(255, 255, 255, 0.15)', color: '#E5E7EB' }}
        >
          ← Back to Dashboard
        </Button>
        <Box sx={{ display: 'flex', gap: 1.5 }}>
          <Button variant="text" onClick={handleManualRefresh} sx={{ color: '#10B981' }}>
            🔄 Refresh
          </Button>
          <Button 
            variant="outlined" 
            color="error" 
            onClick={() => setDeleteDialogOpen(true)}
            sx={{ borderColor: 'rgba(239, 68, 68, 0.3)' }}
          >
            🗑️ Delete Activity
          </Button>
        </Box>
      </Box>

      {/* Generating Radar Indicator */}
      {isGenerating && !recommendation && (
        <Card sx={{ p: 4, mb: 4, textAlign: 'center', border: '1px solid rgba(139, 92, 246, 0.4)', background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.15) 0%, rgba(17, 24, 39, 0.95) 100%)' }}>
          <CircularProgress size={44} sx={{ color: '#8B5CF6', mb: 2 }} />
          <Typography variant="h5" sx={{ fontWeight: 800, color: '#F9FAFB' }}>
            🤖 AI is Processing Your Workout
          </Typography>
          <Typography variant="body2" sx={{ color: '#A78BFA', maxWidth: 500, mx: 'auto', mt: 1 }}>
            Google Gemini is analyzing your energy expenditure, duration, and safety parameters. This page will update automatically in a moment.
          </Typography>
          <LinearProgress sx={{ mt: 3, height: 6, borderRadius: 3, backgroundColor: 'rgba(139, 92, 246, 0.2)', '& .MuiLinearProgress-bar': { backgroundColor: '#8B5CF6' } }} />
        </Card>
      )}

      {/* Full AI Recommendation Report */}
      {recommendation ? (
        <Stack spacing={3.5}>
          {/* Hero Banner */}
          <Card 
            sx={{ 
              p: 3.5, 
              border: `1px solid ${currentMeta.color}50`,
              background: `linear-gradient(135deg, ${currentMeta.color}25 0%, rgba(17, 24, 39, 0.9) 100%)`,
              boxShadow: `0 12px 35px ${currentMeta.color}20`,
            }}
          >
            <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, justifyContent: 'space-between', alignItems: { xs: 'flex-start', sm: 'center' }, gap: 2 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Box
                  sx={{
                    width: 58,
                    height: 58,
                    borderRadius: '16px',
                    backgroundColor: `${currentMeta.color}30`,
                    border: `1px solid ${currentMeta.color}`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '30px',
                    boxShadow: `0 0 20px ${currentMeta.color}40`,
                  }}
                >
                  {currentMeta.emoji}
                </Box>
                <Box>
                  <Typography variant="caption" sx={{ color: currentMeta.color, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                    Personalized AI Coaching
                  </Typography>
                  <Typography variant="h4" sx={{ fontWeight: 800, color: '#F9FAFB' }}>
                    {currentMeta.label} Analysis
                  </Typography>
                </Box>
              </Box>

              <Chip 
                label="✨ Gemini AI Verified" 
                sx={{ 
                  backgroundColor: 'rgba(139, 92, 246, 0.25)', 
                  color: '#C4B5FD', 
                  border: '1px solid rgba(139, 92, 246, 0.5)',
                  fontWeight: 700,
                  fontSize: '0.85rem'
                }} 
              />
            </Box>
          </Card>

          {/* AI Coach Detailed Analysis */}
          <Card sx={{ border: '1px solid rgba(255, 255, 255, 0.1)', background: 'rgba(17, 24, 39, 0.85)' }}>
            <CardContent sx={{ p: 3.5 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 2 }}>
                <Typography variant="h6" sx={{ fontWeight: 800, color: '#F9FAFB' }}>
                  📊 Coach's Workout Evaluation
                </Typography>
              </Box>
              
              <Paper 
                sx={{ 
                  p: 2.5, 
                  backgroundColor: 'rgba(15, 23, 42, 0.6)', 
                  border: '1px solid rgba(255, 255, 255, 0.08)',
                  borderRadius: 2.5,
                  lineHeight: 1.7,
                  color: '#E5E7EB',
                  fontSize: '1rem',
                  whiteSpace: 'pre-line'
                }}
              >
                {recommendation.recommendation || 'No detailed analysis text returned.'}
              </Paper>
            </CardContent>
          </Card>

          {/* Improvements & Suggestions Grid */}
          <Grid container spacing={3}>
            {/* Suggested Improvements */}
            {recommendation.improvements && recommendation.improvements.length > 0 && (
              <Grid item xs={12} md={6}>
                <Card sx={{ height: '100%', border: '1px solid rgba(16, 185, 129, 0.3)', background: 'rgba(17, 24, 39, 0.85)' }}>
                  <CardContent sx={{ p: 3 }}>
                    <Typography variant="h6" sx={{ fontWeight: 700, color: '#10B981', display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                      🚀 Focus Areas & Improvements
                    </Typography>
                    <Stack spacing={1.5}>
                      {recommendation.improvements.map((item, idx) => (
                        <Box 
                          key={idx} 
                          sx={{ 
                            p: 1.5, 
                            borderRadius: '10px', 
                            backgroundColor: 'rgba(16, 185, 129, 0.08)', 
                            border: '1px solid rgba(16, 185, 129, 0.15)',
                            display: 'flex',
                            gap: 1.5
                          }}
                        >
                          <span style={{ color: '#10B981', fontWeight: 800 }}>•</span>
                          <Typography variant="body2" sx={{ color: '#F3F4F6', lineHeight: 1.5 }}>
                            {item}
                          </Typography>
                        </Box>
                      ))}
                    </Stack>
                  </CardContent>
                </Card>
              </Grid>
            )}

            {/* Workout Suggestions */}
            {recommendation.suggestion && recommendation.suggestion.length > 0 && (
              <Grid item xs={12} md={6}>
                <Card sx={{ height: '100%', border: '1px solid rgba(6, 182, 212, 0.3)', background: 'rgba(17, 24, 39, 0.85)' }}>
                  <CardContent sx={{ p: 3 }}>
                    <Typography variant="h6" sx={{ fontWeight: 700, color: '#06B6D4', display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                      🎯 Next Workout Suggestions
                    </Typography>
                    <Stack spacing={1.5}>
                      {recommendation.suggestion.map((item, idx) => (
                        <Box 
                          key={idx} 
                          sx={{ 
                            p: 1.5, 
                            borderRadius: '10px', 
                            backgroundColor: 'rgba(6, 182, 212, 0.08)', 
                            border: '1px solid rgba(6, 182, 212, 0.15)',
                            display: 'flex',
                            gap: 1.5
                          }}
                        >
                          <span style={{ color: '#06B6D4', fontWeight: 800 }}>★</span>
                          <Typography variant="body2" sx={{ color: '#F3F4F6', lineHeight: 1.5 }}>
                            {item}
                          </Typography>
                        </Box>
                      ))}
                    </Stack>
                  </CardContent>
                </Card>
              </Grid>
            )}

            {/* Safety Guidelines */}
            {recommendation.safety && recommendation.safety.length > 0 && (
              <Grid item xs={12}>
                <Card sx={{ border: '1px solid rgba(245, 158, 11, 0.3)', background: 'rgba(17, 24, 39, 0.85)' }}>
                  <CardContent sx={{ p: 3 }}>
                    <Typography variant="h6" sx={{ fontWeight: 700, color: '#F59E0B', display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                      🛡️ Recovery & Injury Prevention Guidelines
                    </Typography>
                    <Grid container spacing={1.5}>
                      {recommendation.safety.map((item, idx) => (
                        <Grid item xs={12} sm={6} key={idx}>
                          <Box 
                            sx={{ 
                              p: 1.5, 
                              borderRadius: '10px', 
                              backgroundColor: 'rgba(245, 158, 11, 0.08)', 
                              border: '1px solid rgba(245, 158, 11, 0.15)',
                              display: 'flex',
                              gap: 1.5,
                              alignItems: 'flex-start'
                            }}
                          >
                            <span style={{ color: '#F59E0B' }}>✓</span>
                            <Typography variant="body2" sx={{ color: '#F3F4F6', lineHeight: 1.5 }}>
                              {item}
                            </Typography>
                          </Box>
                        </Grid>
                      ))}
                    </Grid>
                  </CardContent>
                </Card>
              </Grid>
            )}
          </Grid>
        </Stack>
      ) : (
        !isGenerating && (
          <Card sx={{ p: 5, textAlign: 'center', border: '1px solid rgba(255, 255, 255, 0.1)' }}>
            <Typography variant="h6" sx={{ color: '#F9FAFB', mb: 1 }}>
              No AI Recommendation Available
            </Typography>
            <Typography variant="body2" sx={{ color: '#9CA3AF', mb: 3 }}>
              The AI service did not generate insights for this activity yet.
            </Typography>
            <Button variant="contained" onClick={handleManualRefresh}>
              🔄 Try Fetching Again
            </Button>
          </Card>
        )
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
          Delete Activity Log?
        </DialogTitle>
        <DialogContent>
          <DialogContentText sx={{ color: '#9CA3AF' }}>
            Are you sure you want to permanently delete this workout activity and its AI report?
          </DialogContentText>
        </DialogContent>
        <DialogActions sx={{ pb: 2, px: 3 }}>
          <Button onClick={() => setDeleteDialogOpen(false)} sx={{ color: '#9CA3AF' }}>
            Cancel
          </Button>
          <Button 
            variant="contained" 
            color="error" 
            onClick={handleDelete}
            disabled={deleting}
          >
            {deleting ? 'Deleting...' : 'Delete Activity'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default ActivityDetail;