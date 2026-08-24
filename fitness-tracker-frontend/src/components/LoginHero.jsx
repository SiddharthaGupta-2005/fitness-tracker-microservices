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
  <svg width="22" height="22" viewBox="0 0 24 24" style={{ marginRight: '12px' }}>
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
    { icon: '🤖', title: 'OPENROUTER AI COACH', desc: 'Real-time workout evaluation & recovery guidance', color: '#b4ff00' },
    { icon: '⚡', title: 'EVENT-DRIVEN STREAM', desc: 'RabbitMQ asynchronous high-throughput pipeline', color: '#00d4ff' },
    { icon: '🔒', title: 'OAUTH2 PKCE SECURITY', desc: 'Zero-password cryptographic auth with Keycloak', color: '#a855f7' },
    { icon: '📊', title: 'POLYGLOT ARCHITECTURE', desc: 'MongoDB time-series streams + PostgreSQL state', color: '#ff4d00' },
  ];

  return (
    <Box 
      sx={{ 
        minHeight: '100vh', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center',
        backgroundColor: '#0c0c0f',
        backgroundImage: 'radial-gradient(ellipse at 50% 0%, rgba(180, 255, 0, 0.05) 0%, rgba(12, 12, 15, 0.95) 75%)',
        py: { xs: 5, md: 8 },
        px: { xs: 2.5, sm: 4 }
      }}
    >
      <Container maxWidth="lg">
        <Grid container spacing={6} sx={{ alignItems: 'center' }}>
          
          {/* Left Column: Hero Athletic Branding */}
          <Grid size={{ xs: 12, md: 6.5 }}>
            <Box sx={{ pr: { md: 4 } }}>
              <Chip 
                label="⚡ KINETIC PERFORMANCE DASHBOARD" 
                sx={{ 
                  backgroundColor: 'rgba(180, 255, 0, 0.12)', 
                  color: '#b4ff00', 
                  border: '1px solid rgba(180, 255, 0, 0.3)',
                  fontFamily: '"JetBrains Mono", monospace',
                  fontWeight: 700,
                  fontSize: '0.75rem',
                  mb: 3,
                  px: 0.5
                }} 
              />
              
              <Typography 
                variant="h1" 
                sx={{ 
                  fontSize: { xs: '2.8rem', sm: '3.8rem', md: '4.4rem' },
                  lineHeight: 0.95,
                  mb: 2.5,
                  color: '#f4f4f7'
                }}
              >
                TRACK HARD. <br />
                <span style={{ 
                  color: '#b4ff00',
                  textShadow: '0 0 35px rgba(180, 255, 0, 0.3)'
                }}>
                  COACH WITH AI.
                </span>
              </Typography>

              <Typography 
                variant="body1" 
                sx={{ 
                  color: '#8888a0', 
                  lineHeight: 1.7, 
                  mb: 4.5, 
                  fontSize: '1.05rem',
                  maxWidth: 540
                }}
              >
                High-performance fitness logging with real-time biometric metrics, instant calorie computation, and deep telemetry analysis powered by OpenRouter neural models.
              </Typography>

              {/* 4 Kinetic Feature Badges */}
              <Grid container spacing={2}>
                {features.map((f, i) => (
                  <Grid size={{ xs: 12, sm: 6 }} key={i}>
                    <Box 
                      sx={{ 
                        p: 2.2, 
                        borderRadius: '10px', 
                        backgroundColor: '#13131a', 
                        border: '1px solid rgba(255, 255, 255, 0.07)',
                        display: 'flex',
                        alignItems: 'flex-start',
                        gap: 1.5,
                        transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
                        '&:hover': {
                          borderColor: f.color,
                          backgroundColor: '#1a1a24',
                          transform: 'translateY(-2px)',
                          boxShadow: `0 8px 25px ${f.color}15`
                        }
                      }}
                    >
                      <Box sx={{ fontSize: '1.5rem', lineHeight: 1 }}>{f.icon}</Box>
                      <Box>
                        <Typography 
                          variant="subtitle2" 
                          sx={{ 
                            fontFamily: '"Barlow Condensed", sans-serif',
                            fontWeight: 800, 
                            color: '#f4f4f7',
                            fontSize: '0.95rem',
                            letterSpacing: '0.03em'
                          }}
                        >
                          {f.title}
                        </Typography>
                        <Typography variant="caption" sx={{ color: '#8888a0', lineHeight: 1.4, display: 'block', mt: 0.3 }}>
                          {f.desc}
                        </Typography>
                      </Box>
                    </Box>
                  </Grid>
                ))}
              </Grid>
            </Box>
          </Grid>

          {/* Right Column: High-Impact Google Auth Card */}
          <Grid size={{ xs: 12, md: 5.5 }}>
            <Card 
              sx={{ 
                backgroundColor: '#13131a', 
                border: '1px solid rgba(255, 255, 255, 0.09)',
                boxShadow: '0 25px 60px rgba(0, 0, 0, 0.7), 0 0 35px rgba(180, 255, 0, 0.08)',
                borderRadius: '16px',
                overflow: 'hidden'
              }}
            >
              {/* Card Top Accent Strip */}
              <Box sx={{ height: 4, background: 'linear-gradient(90deg, #b4ff00 0%, #00d4ff 50%, #ff4d00 100%)' }} />

              <Box sx={{ p: 4, textAlign: 'center', pb: 2 }}>
                <Box 
                  sx={{ 
                    width: 52, 
                    height: 52, 
                    borderRadius: '12px', 
                    backgroundColor: '#b4ff00',
                    color: '#0c0c0f',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '26px',
                    fontWeight: 900,
                    mx: 'auto',
                    mb: 2,
                    boxShadow: '0 0 25px rgba(180, 255, 0, 0.4)'
                  }}
                >
                  ⚡
                </Box>
                <Typography 
                  variant="h4" 
                  sx={{ 
                    fontFamily: '"Barlow Condensed", sans-serif',
                    fontWeight: 900, 
                    color: '#f4f4f7',
                    letterSpacing: '0.04em'
                  }}
                >
                  ATHLETE ACCESS PORTAL
                </Typography>
                <Typography variant="body2" sx={{ color: '#8888a0', mt: 0.5 }}>
                  Secure identity authorization via Keycloak OAuth2
                </Typography>
              </Box>

              <CardContent sx={{ p: 4, pt: 1 }}>
                <Typography 
                  variant="caption" 
                  sx={{ 
                    fontFamily: '"JetBrains Mono", monospace',
                    color: '#8888a0', 
                    fontSize: '0.75rem',
                    textTransform: 'uppercase',
                    letterSpacing: '0.08em',
                    display: 'block',
                    textAlign: 'center',
                    mb: 2
                  }}
                >
                  AUTHENTICATE WITH GOOGLE
                </Typography>

                {/* Primary Google Sign-In Action */}
                <Button
                  fullWidth
                  variant="outlined"
                  size="large"
                  onClick={handleGoogleClick}
                  disabled={loading}
                  sx={{
                    py: 1.8,
                    backgroundColor: '#FFFFFF',
                    color: '#0c0c0f',
                    borderColor: '#FFFFFF',
                    fontFamily: '"Barlow Condensed", sans-serif',
                    fontWeight: 800,
                    fontSize: '1.2rem',
                    letterSpacing: '0.04em',
                    borderRadius: '10px',
                    boxShadow: '0 4px 20px rgba(255, 255, 255, 0.15)',
                    transition: 'all 0.2s',
                    '&:hover': {
                      backgroundColor: '#f4f4f7',
                      borderColor: '#FFFFFF',
                      boxShadow: '0 6px 30px rgba(180, 255, 0, 0.3)',
                      transform: 'translateY(-2px)'
                    }
                  }}
                >
                  {loading ? (
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                      <CircularProgress size={22} sx={{ color: '#0c0c0f' }} />
                      <span>CONNECTING TO GOOGLE...</span>
                    </Box>
                  ) : (
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <GoogleIcon />
                      <span>CONTINUE WITH GOOGLE</span>
                    </Box>
                  )}
                </Button>

                <Divider sx={{ my: 3.5, borderColor: 'rgba(255, 255, 255, 0.07)' }} />

                {/* Kinetic Security Attributes */}
                <Stack spacing={1.8}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                    <Box sx={{ color: '#b4ff00', fontWeight: 900, fontFamily: '"JetBrains Mono", monospace' }}>[✓]</Box>
                    <Typography variant="body2" sx={{ color: '#f4f4f7', fontSize: '0.88rem' }}>
                      <strong>Instant 1-Click Access:</strong> Zero password management
                    </Typography>
                  </Box>

                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                    <Box sx={{ color: '#00d4ff', fontWeight: 900, fontFamily: '"JetBrains Mono", monospace' }}>[✓]</Box>
                    <Typography variant="body2" sx={{ color: '#f4f4f7', fontSize: '0.88rem' }}>
                      <strong>Cryptographic PKCE:</strong> Enterprise token rotation & TLS 1.3
                    </Typography>
                  </Box>

                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                    <Box sx={{ color: '#ff4d00', fontWeight: 900, fontFamily: '"JetBrains Mono", monospace' }}>[✓]</Box>
                    <Typography variant="body2" sx={{ color: '#f4f4f7', fontSize: '0.88rem' }}>
                      <strong>Neural Engine:</strong> Instant OpenRouter AI coach synchronization
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
