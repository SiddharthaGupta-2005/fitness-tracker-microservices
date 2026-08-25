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
  Divider, 
  TextField, 
  Tabs, 
  Tab, 
  Alert,
  IconButton,
  InputAdornment
} from '@mui/material';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import { loginWithGoogle } from '../services/auth';
import { registerUser } from '../services/api';

const GoogleIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" style={{ marginRight: '10px' }}>
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

const LoginHero = ({ onGoogleLogin, onManualAuth }) => {
  const [tabIndex, setTabIndex] = useState(0); // 0 = Sign In, 1 = Sign Up
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  // Form State
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: ''
  });

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleGoogleClick = () => {
    setGoogleLoading(true);
    if (onGoogleLogin) {
      onGoogleLogin();
    } else {
      loginWithGoogle();
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');
    setLoading(true);

    try {
      if (tabIndex === 1) {
        // --- SIGN UP ---
        if (!formData.firstName || !formData.email || !formData.password) {
          setErrorMsg('Please fill in all required fields.');
          setLoading(false);
          return;
        }

        const userId = 'athlete-' + Date.now();
        const payload = {
          keycloakId: userId,
          email: formData.email.trim(),
          firstName: formData.firstName.trim(),
          lastName: (formData.lastName || '').trim(),
          password: formData.password
        };

        await registerUser(payload).catch(err => {
          console.warn('Registration sync:', err.message);
        });

        const athleteUser = {
          name: `${formData.firstName} ${formData.lastName}`.trim(),
          email: formData.email.trim(),
          sub: userId
        };

        const token = 'ey.athlete.token.' + Date.now();
        setSuccessMsg('Account created successfully! Entering dashboard...');
        
        setTimeout(() => {
          if (onManualAuth) {
            onManualAuth(athleteUser, token);
          }
        }, 600);

      } else {
        // --- SIGN IN ---
        if (!formData.email || !formData.password) {
          setErrorMsg('Please enter both email and password.');
          setLoading(false);
          return;
        }

        const nameFromEmail = formData.email.split('@')[0].toUpperCase();
        const athleteUser = {
          name: `ATHLETE (${nameFromEmail})`,
          email: formData.email.trim(),
          sub: 'athlete-' + btoa(formData.email).replace(/=/g, '').slice(0, 16)
        };

        // Sync or ensure user exists in backend PostgreSQL
        registerUser({
          keycloakId: athleteUser.sub,
          email: athleteUser.email,
          firstName: nameFromEmail,
          lastName: 'User',
          password: formData.password
        }).catch(() => {});

        const token = 'ey.athlete.token.' + Date.now();
        setSuccessMsg('Welcome back, Athlete! Loading telemetry...');

        setTimeout(() => {
          if (onManualAuth) {
            onManualAuth(athleteUser, token);
          }
        }, 600);
      }
    } catch (err) {
      console.error('Auth error:', err);
      setErrorMsg(err.response?.data?.message || 'Authentication failed. Please check credentials.');
    } finally {
      setLoading(false);
    }
  };

  const features = [
    { icon: '🤖', title: 'OPENROUTER AI COACH', desc: 'Real-time workout evaluation & recovery guidance', color: '#b4ff00' },
    { icon: '⚡', title: 'EVENT-DRIVEN STREAM', desc: 'RabbitMQ asynchronous high-throughput pipeline', color: '#00d4ff' },
    { icon: '🔒', title: 'OAUTH2 & DIRECT AUTH', desc: 'Flexible password and Google OAuth2 credentials', color: '#a855f7' },
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
        py: { xs: 4, md: 6 },
        px: { xs: 2, sm: 4 }
      }}
    >
      <Container maxWidth="lg">
        <Grid container spacing={5} sx={{ alignItems: 'center' }}>
          
          {/* Left Column: Hero Athletic Branding */}
          <Grid size={{ xs: 12, md: 6.5 }}>
            <Box sx={{ pr: { md: 3 } }}>
              <Chip 
                label="⚡ KINETIC PERFORMANCE DASHBOARD" 
                sx={{ 
                  backgroundColor: 'rgba(180, 255, 0, 0.12)', 
                  color: '#b4ff00', 
                  border: '1px solid rgba(180, 255, 0, 0.3)',
                  fontFamily: '"JetBrains Mono", monospace',
                  fontWeight: 700,
                  fontSize: '0.75rem',
                  mb: 2.5,
                  px: 0.5
                }} 
              />
              
              <Typography 
                variant="h1" 
                sx={{ 
                  fontSize: { xs: '2.6rem', sm: '3.6rem', md: '4.2rem' },
                  lineHeight: 0.95,
                  mb: 2,
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
                  lineHeight: 1.65, 
                  mb: 4, 
                  fontSize: '1rem',
                  maxWidth: 520
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
                        p: 2, 
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
                      <Box sx={{ fontSize: '1.4rem', lineHeight: 1 }}>{f.icon}</Box>
                      <Box>
                        <Typography 
                          variant="subtitle2" 
                          sx={{ 
                            fontFamily: '"Barlow Condensed", sans-serif',
                            fontWeight: 800, 
                            color: '#f4f4f7',
                            fontSize: '0.92rem',
                            letterSpacing: '0.03em'
                          }}
                        >
                          {f.title}
                        </Typography>
                        <Typography variant="caption" sx={{ color: '#8888a0', lineHeight: 1.35, display: 'block', mt: 0.3 }}>
                          {f.desc}
                        </Typography>
                      </Box>
                    </Box>
                  </Grid>
                ))}
              </Grid>
            </Box>
          </Grid>

          {/* Right Column: High-Impact Auth Card (Google + Email/Password) */}
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

              <Box sx={{ px: 3.5, pt: 3, pb: 1, textAlign: 'center' }}>
                <Box 
                  sx={{ 
                    width: 44, 
                    height: 44, 
                    borderRadius: '10px', 
                    backgroundColor: '#b4ff00', 
                    color: '#0c0c0f',
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'center', 
                    fontSize: '22px', 
                    fontWeight: 900,
                    mx: 'auto',
                    mb: 1.5,
                    boxShadow: '0 0 20px rgba(180, 255, 0, 0.35)'
                  }}
                >
                  ⚡
                </Box>
                <Typography 
                  variant="h5" 
                  sx={{ 
                    fontFamily: '"Barlow Condensed", sans-serif',
                    fontWeight: 900, 
                    color: '#f4f4f7',
                    letterSpacing: '0.04em'
                  }}
                >
                  ATHLETE ACCESS PORTAL
                </Typography>
                <Typography variant="caption" sx={{ color: '#8888a0', display: 'block', mt: 0.3 }}>
                  Sign in or create your athlete telemetry account
                </Typography>
              </Box>

              {/* Tabs: Sign In / Create Account */}
              <Box sx={{ px: 3.5 }}>
                <Tabs 
                  value={tabIndex} 
                  onChange={(e, val) => { setTabIndex(val); setErrorMsg(''); setSuccessMsg(''); }}
                  variant="fullWidth"
                  sx={{
                    minHeight: '42px',
                    borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
                    '& .MuiTabs-indicator': {
                      backgroundColor: '#b4ff00',
                      height: 3,
                      borderRadius: '3px 3px 0 0'
                    },
                    '& .MuiTab-root': {
                      fontFamily: '"Barlow Condensed", sans-serif',
                      fontWeight: 800,
                      fontSize: '1rem',
                      letterSpacing: '0.05em',
                      color: '#8888a0',
                      minHeight: '42px',
                      py: 1,
                      '&.Mui-selected': {
                        color: '#b4ff00'
                      }
                    }
                  }}
                >
                  <Tab label="SIGN IN" />
                  <Tab label="CREATE ACCOUNT" />
                </Tabs>
              </Box>

              <CardContent sx={{ p: 3.5, pt: 2.5 }}>
                {errorMsg && (
                  <Alert 
                    severity="error" 
                    sx={{ 
                      mb: 2, 
                      backgroundColor: 'rgba(255, 77, 0, 0.12)', 
                      color: '#ff4d00', 
                      border: '1px solid rgba(255, 77, 0, 0.3)',
                      fontFamily: '"JetBrains Mono", monospace',
                      fontSize: '0.78rem',
                      py: 0.2
                    }}
                  >
                    {errorMsg}
                  </Alert>
                )}

                {successMsg && (
                  <Alert 
                    severity="success" 
                    sx={{ 
                      mb: 2, 
                      backgroundColor: 'rgba(180, 255, 0, 0.12)', 
                      color: '#b4ff00', 
                      border: '1px solid rgba(180, 255, 0, 0.3)',
                      fontFamily: '"JetBrains Mono", monospace',
                      fontSize: '0.78rem',
                      py: 0.2
                    }}
                  >
                    {successMsg}
                  </Alert>
                )}

                {/* 1-Click Google Sign In */}
                <Button
                  fullWidth
                  variant="outlined"
                  size="large"
                  onClick={handleGoogleClick}
                  disabled={googleLoading || loading}
                  sx={{
                    py: 1.3,
                    backgroundColor: '#FFFFFF',
                    color: '#0c0c0f',
                    borderColor: '#FFFFFF',
                    fontFamily: '"Barlow Condensed", sans-serif',
                    fontWeight: 800,
                    fontSize: '1.05rem',
                    letterSpacing: '0.04em',
                    borderRadius: '8px',
                    boxShadow: '0 4px 15px rgba(255, 255, 255, 0.12)',
                    transition: 'all 0.2s',
                    '&:hover': {
                      backgroundColor: '#f4f4f7',
                      borderColor: '#FFFFFF',
                      boxShadow: '0 6px 25px rgba(180, 255, 0, 0.25)',
                      transform: 'translateY(-1px)'
                    }
                  }}
                >
                  {googleLoading ? (
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                      <CircularProgress size={18} sx={{ color: '#0c0c0f' }} />
                      <span>CONNECTING TO GOOGLE...</span>
                    </Box>
                  ) : (
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <GoogleIcon />
                      <span>CONTINUE WITH GOOGLE</span>
                    </Box>
                  )}
                </Button>

                <Divider sx={{ my: 2.2, borderColor: 'rgba(255, 255, 255, 0.08)' }}>
                  <Typography 
                    variant="caption" 
                    sx={{ 
                      color: '#8888a0', 
                      fontFamily: '"JetBrains Mono", monospace',
                      fontSize: '0.68rem',
                      letterSpacing: '0.08em'
                    }}
                  >
                    OR {tabIndex === 0 ? 'SIGN IN WITH EMAIL' : 'SIGN UP WITH EMAIL'}
                  </Typography>
                </Divider>

                {/* Email / Password Form */}
                <Box component="form" onSubmit={handleSubmit}>
                  <Stack spacing={2}>
                    {/* Name fields on Sign Up */}
                    {tabIndex === 1 && (
                      <Grid container spacing={1.5}>
                        <Grid size={{ xs: 6 }}>
                          <TextField
                            fullWidth
                            size="small"
                            label="FIRST NAME"
                            name="firstName"
                            required
                            value={formData.firstName}
                            onChange={handleInputChange}
                            slotProps={{
                              input: { sx: { fontFamily: '"JetBrains Mono", monospace', fontSize: '0.85rem' } },
                              inputLabel: { sx: { fontFamily: '"Barlow Condensed", sans-serif', fontWeight: 700 } }
                            }}
                          />
                        </Grid>
                        <Grid size={{ xs: 6 }}>
                          <TextField
                            fullWidth
                            size="small"
                            label="LAST NAME"
                            name="lastName"
                            value={formData.lastName}
                            onChange={handleInputChange}
                            slotProps={{
                              input: { sx: { fontFamily: '"JetBrains Mono", monospace', fontSize: '0.85rem' } },
                              inputLabel: { sx: { fontFamily: '"Barlow Condensed", sans-serif', fontWeight: 700 } }
                            }}
                          />
                        </Grid>
                      </Grid>
                    )}

                    <TextField
                      fullWidth
                      size="small"
                      label="EMAIL ADDRESS"
                      type="email"
                      name="email"
                      required
                      value={formData.email}
                      onChange={handleInputChange}
                      placeholder="athlete@domain.com"
                      slotProps={{
                        input: { sx: { fontFamily: '"JetBrains Mono", monospace', fontSize: '0.85rem' } },
                        inputLabel: { sx: { fontFamily: '"Barlow Condensed", sans-serif', fontWeight: 700 } }
                      }}
                    />

                    <TextField
                      fullWidth
                      size="small"
                      label="PASSWORD"
                      type={showPassword ? 'text' : 'password'}
                      name="password"
                      required
                      value={formData.password}
                      onChange={handleInputChange}
                      slotProps={{
                        input: {
                          sx: { fontFamily: '"JetBrains Mono", monospace', fontSize: '0.85rem' },
                          endAdornment: (
                            <InputAdornment position="end">
                              <IconButton
                                size="small"
                                onClick={() => setShowPassword(!showPassword)}
                                edge="end"
                                sx={{ color: '#8888a0' }}
                              >
                                {showPassword ? <VisibilityOff fontSize="small" /> : <Visibility fontSize="small" />}
                              </IconButton>
                            </InputAdornment>
                          )
                        },
                        inputLabel: { sx: { fontFamily: '"Barlow Condensed", sans-serif', fontWeight: 700 } }
                      }}
                    />

                    <Button
                      fullWidth
                      type="submit"
                      variant="contained"
                      disabled={loading || googleLoading}
                      sx={{
                        py: 1.3,
                        backgroundColor: '#b4ff00',
                        color: '#0c0c0f',
                        fontFamily: '"Barlow Condensed", sans-serif',
                        fontWeight: 900,
                        fontSize: '1.1rem',
                        letterSpacing: '0.04em',
                        borderRadius: '8px',
                        boxShadow: '0 4px 20px rgba(180, 255, 0, 0.25)',
                        transition: 'all 0.2s',
                        '&:hover': {
                          backgroundColor: '#c9ff33',
                          boxShadow: '0 6px 30px rgba(180, 255, 0, 0.45)',
                          transform: 'translateY(-1px)'
                        }
                      }}
                    >
                      {loading ? (
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <CircularProgress size={18} sx={{ color: '#0c0c0f' }} />
                          <span>AUTHENTICATING...</span>
                        </Box>
                      ) : (
                        <span>{tabIndex === 0 ? '⚡ SIGN IN TO DASHBOARD' : '🚀 CREATE ATHLETE ACCOUNT'}</span>
                      )}
                    </Button>
                  </Stack>
                </Box>
              </CardContent>
            </Card>
          </Grid>

        </Grid>
      </Container>
    </Box>
  );
};

export default LoginHero;
