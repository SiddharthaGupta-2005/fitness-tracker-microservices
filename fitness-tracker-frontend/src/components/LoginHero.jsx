import React, { useState } from 'react';
import { 
  Box, 
  Button, 
  Container, 
  Typography, 
  Grid, 
  Card, 
  CardContent, 
  Chip, 
  CircularProgress,
  Stack,
  Divider
} from '@mui/material';
import { loginWithGoogle } from '../services/auth';

const GoogleIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" style={{ marginRight: '12px' }}>
    <path
      fill="#4285F4"
      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
    />
    <path
      fill="#34A853"
      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
    />
    <path
      fill="#FBBC05"
      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
    />
    <path
      fill="#EA4335"
      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
    />
  </svg>
);

const LoginHero = ({ onGoogleLogin }) => {
  const [loading, setLoading] = useState(false);

  const handleGoogleClick = () => {
    setLoading(true);
    if (onGoogleLogin) {
      onGoogleLogin();
    } else {
      loginWithGoogle();
    }
  };

  const features = [
    { icon: '🤖', title: 'OpenRouter AI Coach', desc: 'Real-time workout evaluation & recovery guidance' },
    { icon: '⚡', title: 'RabbitMQ Microservices', desc: 'Event-driven message routing & high throughput' },
    { icon: '🔒', title: 'OAuth2 & PKCE', desc: 'Enterprise security & reactive identity sync' },
    { icon: '📊', title: 'Polyglot DB Architecture', desc: 'MongoDB for activity streams & PostgreSQL for users' },
  ];

  return (
    <Box 
      sx={{ 
        minHeight: '100vh', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center',
        background: 'radial-gradient(ellipse at 50% 0%, #111827 0%, #0B0F19 80%)',
        py: { xs: 4, md: 8 },
        px: { xs: 2, sm: 4 }
      }}
    >
      <Container maxWidth="lg">
        <Grid container spacing={5} sx={{ alignItems: 'center' }}>
          
          {/* Left Column: Hero Brand & Architecture Highlights */}
          <Grid size={{ xs: 12, md: 6.5 }}>
            <Box sx={{ pr: { md: 4 } }}>
              <Chip 
                label="⚡ Spring Cloud Microservices + OpenRouter AI" 
                sx={{ 
                  backgroundColor: 'rgba(16, 185, 129, 0.15)', 
                  color: '#10B981', 
                  border: '1px solid rgba(16, 185, 129, 0.3)',
                  fontWeight: 700,
                  mb: 2.5
                }} 
              />
              
              <Typography 
                variant="h2" 
                sx={{ 
                  fontWeight: 900, 
                  letterSpacing: '-0.03em',
                  lineHeight: 1.15,
                  mb: 2.5,
                  color: '#F9FAFB'
                }}
              >
                Track Workouts. <br />
                <span style={{ 
                  background: 'linear-gradient(135deg, #10B981 0%, #06B6D4 100%)', 
                  WebkitBackgroundClip: 'text', 
                  WebkitTextFillColor: 'transparent' 
                }}>
                  Supercharge with AI.
                </span>
              </Typography>

              <Typography 
                variant="body1" 
                sx={{ 
                  color: '#9CA3AF', 
                  lineHeight: 1.7, 
                  mb: 4, 
                  fontSize: '1.05rem',
                  maxWidth: 560
                }}
              >
                Log your fitness routines, monitor calories, and receive personalized AI coaching insights generated in real time through an event-driven microservices architecture.
              </Typography>

              {/* 4 Feature Badges */}
              <Grid container spacing={2}>
                {features.map((f, i) => (
                  <Grid size={{ xs: 12, sm: 6 }} key={i}>
                    <Box 
                      sx={{ 
                        p: 2, 
                        borderRadius: 3, 
                        backgroundColor: 'rgba(17, 24, 39, 0.6)', 
                        border: '1px solid rgba(255, 255, 255, 0.06)',
                        display: 'flex',
                        alignItems: 'flex-start',
                        gap: 1.5,
                        transition: 'all 0.2s',
                        '&:hover': {
                          borderColor: 'rgba(16, 185, 129, 0.3)',
                          backgroundColor: 'rgba(17, 24, 39, 0.85)',
                          transform: 'translateY(-2px)'
                        }
                      }}
                    >
                      <Box sx={{ fontSize: '1.6rem' }}>{f.icon}</Box>
                      <Box>
                        <Typography variant="subtitle2" sx={{ fontWeight: 700, color: '#F9FAFB' }}>
                          {f.title}
                        </Typography>
                        <Typography variant="caption" sx={{ color: '#9CA3AF', lineHeight: 1.4, display: 'block' }}>
                          {f.desc}
                        </Typography>
                      </Box>
                    </Box>
                  </Grid>
                ))}
              </Grid>
            </Box>
          </Grid>

          {/* Right Column: Google-Only Sign-In Card */}
          <Grid size={{ xs: 12, md: 5.5 }}>
            <Card 
              sx={{ 
                background: 'rgba(17, 24, 39, 0.92)', 
                backdropFilter: 'blur(20px)',
                border: '1px solid rgba(16, 185, 129, 0.3)',
                boxShadow: '0 20px 50px rgba(0, 0, 0, 0.5), 0 0 30px rgba(16, 185, 129, 0.15)',
                borderRadius: 4,
                overflow: 'hidden'
              }}
            >
              {/* Card Header with Glowing Gradient */}
              <Box 
                sx={{ 
                  p: 3.5, 
                  pb: 3,
                  background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.12) 0%, rgba(6, 182, 212, 0.05) 100%)',
                  borderBottom: '1px solid rgba(255, 255, 255, 0.06)',
                  textAlign: 'center'
                }}
              >
                <Box 
                  sx={{ 
                    width: 48, 
                    height: 48, 
                    borderRadius: 2.5, 
                    background: 'linear-gradient(135deg, #10B981 0%, #06B6D4 100%)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '24px',
                    mx: 'auto',
                    mb: 1.5,
                    boxShadow: '0 0 20px rgba(16, 185, 129, 0.4)'
                  }}
                >
                  ⚡
                </Box>
                <Typography variant="h4" sx={{ fontWeight: 800, color: '#F9FAFB' }}>
                  FitPulse <span style={{ color: '#10B981' }}>AI</span>
                </Typography>
                <Typography variant="body2" sx={{ color: '#9CA3AF', mt: 0.5 }}>
                  Next-Gen Fitness Tracking & AI Coaching
                </Typography>
              </Box>

              <CardContent sx={{ p: { xs: 3, sm: 4 } }}>
                <Box sx={{ textAlign: 'center', mb: 3 }}>
                  <Typography variant="h6" sx={{ fontWeight: 700, color: '#F9FAFB', mb: 1 }}>
                    Welcome to Your Dashboard
                  </Typography>
                  <Typography variant="body2" sx={{ color: '#9CA3AF' }}>
                    Sign in or create an account instantly with your Google account to get started.
                  </Typography>
                </Box>

                {/* Prominent Google Sign-In Button */}
                <Button
                  fullWidth
                  variant="outlined"
                  size="large"
                  onClick={handleGoogleClick}
                  disabled={loading}
                  sx={{
                    py: 1.8,
                    mb: 3,
                    backgroundColor: '#FFFFFF',
                    color: '#1F2937',
                    borderColor: '#E5E7EB',
                    fontWeight: 800,
                    fontSize: '1.05rem',
                    textTransform: 'none',
                    borderRadius: 3,
                    boxShadow: '0 4px 14px rgba(0,0,0,0.25)',
                    transition: 'all 0.2s',
                    '&:hover': {
                      backgroundColor: '#F9FAFB',
                      borderColor: '#D1D5DB',
                      boxShadow: '0 6px 20px rgba(255,255,255,0.15)',
                      transform: 'translateY(-1px)'
                    }
                  }}
                >
                  {loading ? (
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                      <CircularProgress size={22} color="inherit" />
                      <span>Connecting to Google...</span>
                    </Box>
                  ) : (
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <GoogleIcon />
                      <span>Continue with Google</span>
                    </Box>
                  )}
                </Button>

                <Divider sx={{ my: 3, borderColor: 'rgba(255, 255, 255, 0.08)' }} />

                {/* Features & Security List */}
                <Stack spacing={1.5}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                    <Box sx={{ color: '#10B981', fontWeight: 800, fontSize: '1rem' }}>✓</Box>
                    <Typography variant="caption" sx={{ color: '#D1D5DB', fontSize: '0.85rem' }}>
                      <strong>1-Click Instant Access:</strong> No passwords to remember or reset
                    </Typography>
                  </Box>

                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                    <Box sx={{ color: '#06B6D4', fontWeight: 800, fontSize: '1rem' }}>✓</Box>
                    <Typography variant="caption" sx={{ color: '#D1D5DB', fontSize: '0.85rem' }}>
                      <strong>Enterprise Security:</strong> Protected by OAuth2 with PKCE protocol
                    </Typography>
                  </Box>

                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                    <Box sx={{ color: '#8B5CF6', fontWeight: 800, fontSize: '1rem' }}>✓</Box>
                    <Typography variant="caption" sx={{ color: '#D1D5DB', fontSize: '0.85rem' }}>
                      <strong>Real-Time AI Sync:</strong> Instant workout analysis on login
                    </Typography>
                  </Box>
                </Stack>
              </CardContent>
            </Card>
          </Grid>

        </Grid>
      </Container>
    </Box>
  );
};

export default LoginHero;
