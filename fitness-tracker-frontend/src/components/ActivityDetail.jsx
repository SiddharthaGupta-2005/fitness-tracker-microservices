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
  DialogActions
} from '@mui/material';
import { getActivityDetail, deleteActivity } from '../services/api';

const ACTIVITY_METADATA = {
  RUNNING: { label: 'Running', emoji: '🏃‍♂️', color: '#10B981', gradient: 'linear-gradient(135deg, rgba(16, 185, 129, 0.15) 0%, rgba(6, 182, 212, 0.05) 100%)' },
  WALKING: { label: 'Walking', emoji: '🚶‍♂️', color: '#14B8A6', gradient: 'linear-gradient(135deg, rgba(20, 184, 166, 0.15) 0%, rgba(59, 130, 246, 0.05) 100%)' },
  STRENGTH_TRAINING: { label: 'Strength Training', emoji: '🏋️‍♂️', color: '#F59E0B', gradient: 'linear-gradient(135deg, rgba(245, 158, 11, 0.15) 0%, rgba(239, 68, 68, 0.05) 100%)' },
  POWER_LIFTING: { label: 'Powerlifting', emoji: '🦾', color: '#EF4444', gradient: 'linear-gradient(135deg, rgba(239, 68, 68, 0.15) 0%, rgba(168, 85, 247, 0.05) 100%)' },
  SWIMMING: { label: 'Swimming', emoji: '🏊‍♂️', color: '#06B6D4', gradient: 'linear-gradient(135deg, rgba(6, 182, 212, 0.15) 0%, rgba(16, 185, 129, 0.05) 100%)' },
  CYCLING: { label: 'Cycling', emoji: '🚴‍♂️', color: '#3B82F6', gradient: 'linear-gradient(135deg, rgba(59, 130, 246, 0.15) 0%, rgba(139, 92, 246, 0.05) 100%)' },
  CARDIO: { label: 'Cardio HIIT', emoji: '⚡', color: '#EC4899', gradient: 'linear-gradient(135deg, rgba(236, 72, 153, 0.15) 0%, rgba(244, 63, 94, 0.05) 100%)' },
  YOGA: { label: 'Yoga Flow', emoji: '🧘‍♀️', color: '#8B5CF6', gradient: 'linear-gradient(135deg, rgba(139, 92, 246, 0.15) 0%, rgba(236, 72, 153, 0.05) 100%)' },
  PILATES: { label: 'Pilates', emoji: '🤸‍♀️', color: '#A855F7', gradient: 'linear-gradient(135deg, rgba(168, 85, 247, 0.15) 0%, rgba(59, 130, 246, 0.05) 100%)' },
  OTHER: { label: 'General Workout', emoji: '🔥', color: '#F97316', gradient: 'linear-gradient(135deg, rgba(249, 115, 22, 0.15) 0%, rgba(245, 158, 11, 0.05) 100%)' },
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
          <Button 
            variant="text" 
            onClick={handleManualRefresh} 
            disabled={isRefreshing}
            sx={{ color: '#10B981', fontWeight: 700 }}
          >
            {isRefreshing ? (
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <CircularProgress size={16} color="inherit" />
                <span>Refreshing...</span>
              </Box>
            ) : (
              <span>🔄 Refresh</span>
            )}
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
            🤖 AI Coach is Processing Your Workout
          </Typography>
          <Typography variant="body2" sx={{ color: '#A78BFA', maxWidth: 500, mx: 'auto', mt: 1 }}>
            OpenRouter AI is analyzing your energy expenditure, duration, and safety parameters. This page will update automatically in a moment.
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
                label="✨ AI Coach Verified" 
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

          {/* Performance Analysis Card */}
          <Card sx={{ border: '1px solid rgba(255, 255, 255, 0.08)', background: 'rgba(17, 24, 39, 0.85)' }}>
            <CardContent sx={{ p: 3 }}>
              <Typography variant="h6" sx={{ fontWeight: 700, color: '#F9FAFB', display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                📊 Performance Breakdown
              </Typography>
              <Typography variant="body1" sx={{ color: '#E5E7EB', lineHeight: 1.8, whiteSpace: 'pre-line' }}>
                {recommendation.recommendation || 'Detailed workout evaluation complete.'}
              </Typography>
            </CardContent>
          </Card>

          {/* Improvements & Suggestions Grid */}
          <Grid container spacing={3}>
            {/* Suggested Improvements */}
            {recommendation.improvements && recommendation.improvements.length > 0 && (
              <Grid size={{ xs: 12, md: 6 }}>
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
              <Grid size={{ xs: 12, md: 6 }}>
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
              <Grid size={{ xs: 12 }}>
                <Card sx={{ border: '1px solid rgba(245, 158, 11, 0.3)', background: 'rgba(17, 24, 39, 0.85)' }}>
                  <CardContent sx={{ p: 3 }}>
                    <Typography variant="h6" sx={{ fontWeight: 700, color: '#F59E0B', display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                      🛡️ Recovery & Injury Prevention Guidelines
                    </Typography>
                    <Grid container spacing={1.5}>
                      {recommendation.safety.map((item, idx) => (
                        <Grid size={{ xs: 12, sm: 6 }} key={idx}>
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
          <Card sx={{ p: 5, textAlign: 'center', border: '1px solid rgba(255, 255, 255, 0.1)', background: 'rgba(17, 24, 39, 0.6)' }}>
            <Box sx={{ fontSize: '3rem', mb: 1 }}>🤖</Box>
            <Typography variant="h5" sx={{ color: '#F9FAFB', fontWeight: 700, mb: 1 }}>
              No AI Recommendation Found Yet
            </Typography>
            <Typography variant="body2" sx={{ color: '#9CA3AF', maxWidth: 450, mx: 'auto', mb: 3 }}>
              Click below to generate a fresh, personalized AI coaching report for this workout using OpenRouter.
            </Typography>
            <Button 
              variant="contained" 
              size="large"
              onClick={handleManualRefresh}
              disabled={isRefreshing}
              sx={{
                background: 'linear-gradient(135deg, #10B981 0%, #059669 100%)',
                fontWeight: 700,
                px: 4,
                py: 1.2
              }}
            >
              {isRefreshing ? (
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <CircularProgress size={18} color="inherit" />
                  <span>Generating AI Report...</span>
                </Box>
              ) : (
                <span>⚡ Generate AI Coaching Report Now</span>
              )}
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