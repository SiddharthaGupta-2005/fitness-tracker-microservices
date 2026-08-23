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
  TextField, 
  Tabs, 
  Tab, 
  Alert, 
  CircularProgress,
  InputAdornment,
  IconButton,
  Divider,
  Stack
} from '@mui/material';
import { loginWithCredentials } from '../services/auth';

const LoginHero = ({ onLoginSuccess, onKeycloakSso }) => {
  const [tabIndex, setTabIndex] = useState(0); // 0: Sign In, 1: Sign Up
  
  // Sign In State
  const [loginUsername, setLoginUsername] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  
  // Sign Up State
  const [signUpData, setSignUpData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    username: '',
    password: '',
  });

  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const handleSignIn = async (e) => {
    e.preventDefault();
    if (!loginUsername || !loginPassword) return;
    
    setLoading(true);
    setErrorMsg('');
    try {
      const authResult = await loginWithCredentials(loginUsername, loginPassword);
      if (onLoginSuccess) {
        onLoginSuccess(authResult);
      }
    } catch (err) {
      console.error('Sign in failed:', err);
      if (err.response && err.response.data && err.response.data.error_description) {
        setErrorMsg(err.response.data.error_description);
      } else if (err.response && err.response.status === 401) {
        setErrorMsg('Invalid username or password. Please verify your credentials.');
      } else {
        setErrorMsg('Unable to connect to Keycloak authentication server (Port 8181).');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleFillDemo = () => {
    setLoginUsername('testuser');
    setLoginPassword('Password123!');
    setErrorMsg('');
  };

  const features = [
    { icon: '🤖', title: 'Gemini AI Coach', desc: 'Real-time workout evaluation & recovery guidance' },
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
        <Grid container spacing={4} alignItems="center">
          
          {/* Left Column: Hero Brand & Architecture Highlights */}
          <Grid item xs={12} md={7}>
            <Box sx={{ pr: { md: 4 } }}>
              <Chip 
                label="⚡ Spring Cloud Microservices + Gemini AI" 
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
                  fontWeight: 800, 
                  fontSize: { xs: '2.4rem', sm: '3.2rem', md: '3.8rem' },
                  lineHeight: 1.15,
                  mb: 2.5,
                  background: 'linear-gradient(135deg, #FFFFFF 0%, #E5E7EB 50%, #10B981 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                }}
              >
                Intelligent Fitness Tracking. Powered by Microservices.
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
                  <Grid item xs={12} sm={6} key={i}>
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

          {/* Right Column: In-App Glassmorphic Login & Sign-Up Card */}
          <Grid item xs={12} md={5}>
            <Card 
              sx={{ 
                background: 'rgba(17, 24, 39, 0.85)', 
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
                  p: 3, 
                  pb: 2,
                  background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.12) 0%, rgba(6, 182, 212, 0.05) 100%)',
                  borderBottom: '1px solid rgba(255, 255, 255, 0.06)'
                }}
              >
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 1 }}>
                  <Box 
                    sx={{ 
                      width: 36, 
                      height: 36, 
                      borderRadius: 2, 
                      background: 'linear-gradient(135deg, #10B981 0%, #06B6D4 100%)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '18px'
                    }}
                  >
                    ⚡
                  </Box>
                  <Typography variant="h5" sx={{ fontWeight: 800, color: '#F9FAFB' }}>
                    FitPulse <span style={{ color: '#10B981' }}>Account</span>
                  </Typography>
                </Box>
                <Typography variant="caption" sx={{ color: '#9CA3AF' }}>
                  Secure OAuth2 PKCE Authentication
                </Typography>
              </Box>

              <CardContent sx={{ p: { xs: 2.5, sm: 3.5 } }}>
                {/* Tabs: Sign In / Quick Demo */}
                <Tabs 
                  value={tabIndex} 
                  onChange={(e, val) => { setTabIndex(val); setErrorMsg(''); setSuccessMsg(''); }}
                  variant="fullWidth"
                  sx={{ 
                    mb: 3, 
                    backgroundColor: 'rgba(0, 0, 0, 0.25)', 
                    borderRadius: 2.5,
                    p: 0.5,
                    '& .MuiTabs-indicator': { display: 'none' },
                    '& .MuiTab-root': {
                      borderRadius: 2,
                      fontWeight: 700,
                      minHeight: 40,
                      color: '#9CA3AF',
                      '&.Mui-selected': {
                        backgroundColor: '#10B981',
                        color: '#FFFFFF'
                      }
                    }
                  }}
                >
                  <Tab label="Sign In" />
                  <Tab label="Create Account" />
                </Tabs>

                {errorMsg && (
                  <Alert severity="error" sx={{ mb: 2.5, backgroundColor: 'rgba(239, 68, 68, 0.15)', color: '#F87171', border: '1px solid rgba(239, 68, 68, 0.3)' }}>
                    {errorMsg}
                  </Alert>
                )}

                {successMsg && (
                  <Alert severity="success" sx={{ mb: 2.5, backgroundColor: 'rgba(16, 185, 129, 0.15)', color: '#34D399', border: '1px solid rgba(16, 185, 129, 0.3)' }}>
                    {successMsg}
                  </Alert>
                )}

                {/* TAB 0: SIGN IN FORM */}
                {tabIndex === 0 && (
                  <Box component="form" onSubmit={handleSignIn}>
                    <Stack spacing={2.2}>
                      <TextField
                        fullWidth
                        label="Username or Email"
                        variant="outlined"
                        required
                        value={loginUsername}
                        onChange={(e) => setLoginUsername(e.target.value)}
                        placeholder="e.g. testuser"
                        autoFocus
                      />

                      <TextField
                        fullWidth
                        label="Password"
                        type={showPassword ? 'text' : 'password'}
                        variant="outlined"
                        required
                        value={loginPassword}
                        onChange={(e) => setLoginPassword(e.target.value)}
                        placeholder="••••••••"
                        InputProps={{
                          endAdornment: (
                            <InputAdornment position="end">
                              <IconButton 
                                onClick={() => setShowPassword(!showPassword)} 
                                edge="end"
                                sx={{ color: '#9CA3AF' }}
                              >
                                {showPassword ? '👁️' : '🔒'}
                              </IconButton>
                            </InputAdornment>
                          ),
                        }}
                      />

                      {/* Quick Auto-Fill Helper */}
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Button 
                          size="small" 
                          variant="text" 
                          onClick={handleFillDemo}
                          sx={{ fontSize: '0.8rem', color: '#10B981', p: 0 }}
                        >
                          ⚡ Auto-fill testuser
                        </Button>
                      </Box>

                      {/* Sign In Submit Button */}
                      <Button
                        type="submit"
                        variant="contained"
                        size="large"
                        fullWidth
                        disabled={loading}
                        sx={{
                          py: 1.5,
                          fontSize: '1rem',
                          fontWeight: 700,
                          background: 'linear-gradient(135deg, #10B981 0%, #059669 100%)',
                          boxShadow: '0 4px 15px rgba(16, 185, 129, 0.4)',
                        }}
                      >
                        {loading ? (
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                            <CircularProgress size={20} color="inherit" />
                            <span>Authenticating with Keycloak...</span>
                          </Box>
                        ) : (
                          <span>🚀 Sign In to Dashboard</span>
                        )}
                      </Button>
                    </Stack>
                  </Box>
                )}

                {/* TAB 1: CREATE ACCOUNT / SIGN UP GUIDE */}
                {tabIndex === 1 && (
                  <Box sx={{ textAlign: 'center', py: 1 }}>
                    <Typography variant="h6" sx={{ fontWeight: 700, color: '#F9FAFB', mb: 1 }}>
                      Instant Self-Registration
                    </Typography>
                    <Typography variant="body2" sx={{ color: '#9CA3AF', mb: 3, lineHeight: 1.6 }}>
                      Sign up through the Keycloak Identity Provider or use the default test credentials:
                    </Typography>

                    <Card sx={{ p: 2.5, mb: 3, backgroundColor: 'rgba(16, 185, 129, 0.08)', border: '1px solid rgba(16, 185, 129, 0.25)', textAlign: 'left' }}>
                      <Typography variant="subtitle2" sx={{ color: '#10B981', fontWeight: 700, mb: 1 }}>
                        🔑 Instant Test User:
                      </Typography>
                      <Typography variant="body2" sx={{ color: '#E5E7EB', fontFamily: 'monospace' }}>
                        Username: <strong>testuser</strong>
                      </Typography>
                      <Typography variant="body2" sx={{ color: '#E5E7EB', fontFamily: 'monospace', mt: 0.5 }}>
                        Password: <strong>Password123!</strong>
                      </Typography>
                    </Card>

                    <Button 
                      variant="contained" 
                      fullWidth
                      onClick={() => { setTabIndex(0); handleFillDemo(); }}
                      sx={{ mb: 2 }}
                    >
                      Use Demo Account
                    </Button>

                    <Button 
                      variant="outlined" 
                      fullWidth
                      onClick={onKeycloakSso}
                      sx={{ borderColor: 'rgba(255, 255, 255, 0.15)', color: '#9CA3AF' }}
                    >
                      Open Keycloak Registration Portal
                    </Button>
                  </Box>
                )}

                <Divider sx={{ my: 3, borderColor: 'rgba(255, 255, 255, 0.08)' }} />

                {/* Secondary Option */}
                <Button 
                  variant="text" 
                  fullWidth 
                  size="small"
                  onClick={onKeycloakSso}
                  sx={{ color: '#9CA3AF', fontSize: '0.8rem' }}
                >
                  🔐 Or Authenticate via Keycloak SSO Redirect
                </Button>
              </CardContent>
            </Card>
          </Grid>

        </Grid>
      </Container>
    </Box>
  );
};

export default LoginHero;
