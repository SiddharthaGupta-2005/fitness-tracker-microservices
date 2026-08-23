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
import { loginWithCredentials, loginWithGoogle } from '../services/auth';
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

const LoginHero = ({ onLoginSuccess, onKeycloakSso, onGoogleLogin }) => {
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
    confirmPassword: '',
  });
  const [showSignUpPassword, setShowSignUpPassword] = useState(false);

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
        setErrorMsg('Unable to connect to authentication server. Please check Keycloak service.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleSignUp = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    if (signUpData.password !== signUpData.confirmPassword) {
      setErrorMsg('Passwords do not match. Please re-enter.');
      return;
    }

    if (signUpData.password.length < 6) {
      setErrorMsg('Password must be at least 6 characters long.');
      return;
    }

    setLoading(true);
    try {
      // Register in User Microservice
      await registerUser({
        email: signUpData.email.trim(),
        password: signUpData.password,
        firstName: signUpData.firstName.trim(),
        lastName: signUpData.lastName.trim(),
      });

      setSuccessMsg('Account created successfully! Signing you in...');
      
      // Automatically attempt login with new credentials
      try {
        const authResult = await loginWithCredentials(signUpData.email.trim() || signUpData.username.trim(), signUpData.password);
        if (onLoginSuccess) {
          onLoginSuccess(authResult);
        }
      } catch (loginErr) {
        setSuccessMsg('Account registered! Please sign in with your credentials.');
        setLoginUsername(signUpData.email.trim());
        setTabIndex(0);
      }
    } catch (err) {
      console.error('Sign up failed:', err);
      if (err.response && err.response.data && err.response.data.message) {
        setErrorMsg(err.response.data.message);
      } else {
        setErrorMsg('Registration encountered an issue. You can also sign in directly.');
      }
    } finally {
      setLoading(false);
    }
  };

  const features = [
    { icon: '🤖', title: 'Groq AI Coach', desc: 'Real-time workout evaluation & recovery guidance' },
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
        <Grid container spacing={4} sx={{ alignItems: 'center' }}>
          
          {/* Left Column: Hero Brand & Architecture Highlights */}
          <Grid size={{ xs: 12, md: 6.5 }}>
            <Box sx={{ pr: { md: 4 } }}>
              <Chip 
                label="⚡ Spring Cloud Microservices + Groq AI" 
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

          {/* Right Column: In-App Glassmorphic Login & Sign-Up Card */}
          <Grid size={{ xs: 12, md: 5.5 }}>
            <Card 
              sx={{ 
                background: 'rgba(17, 24, 39, 0.9)', 
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
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 0.5 }}>
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
                    FitPulse <span style={{ color: '#10B981' }}>AI</span>
                  </Typography>
                </Box>
                <Typography variant="caption" sx={{ color: '#9CA3AF' }}>
                  Secure OAuth2 PKCE Authentication
                </Typography>
              </Box>

              <CardContent sx={{ p: { xs: 2.5, sm: 3.5 } }}>
                {/* Tabs: Sign In / Create Account */}
                <Tabs 
                  value={tabIndex} 
                  onChange={(e, val) => { setTabIndex(val); setErrorMsg(''); setSuccessMsg(''); }}
                  variant="fullWidth"
                  sx={{ 
                    mb: 3, 
                    backgroundColor: 'rgba(0, 0, 0, 0.3)', 
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

                {/* SIGN IN WITH GOOGLE BUTTON */}
                <Button
                  fullWidth
                  variant="outlined"
                  size="large"
                  onClick={onGoogleLogin || loginWithGoogle}
                  sx={{
                    py: 1.4,
                    mb: 2.5,
                    backgroundColor: '#FFFFFF',
                    color: '#374151',
                    borderColor: '#E5E7EB',
                    fontWeight: 700,
                    fontSize: '0.95rem',
                    textTransform: 'none',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.2)',
                    '&:hover': {
                      backgroundColor: '#F3F4F6',
                      borderColor: '#D1D5DB',
                      boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
                    }
                  }}
                >
                  <GoogleIcon />
                  {tabIndex === 0 ? 'Sign in with Google' : 'Sign up with Google'}
                </Button>

                <Divider sx={{ mb: 2.5, borderColor: 'rgba(255, 255, 255, 0.1)' }}>
                  <Typography variant="caption" sx={{ color: '#6B7280', px: 1, textTransform: 'uppercase', fontWeight: 600 }}>
                    or continue with email
                  </Typography>
                </Divider>

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
                        placeholder="Enter your username or email"
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
                        slotProps={{
                          input: {
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
                          },
                        }}
                      />

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
                            <span>Authenticating...</span>
                          </Box>
                        ) : (
                          <span>🚀 Sign In to Dashboard</span>
                        )}
                      </Button>
                    </Stack>
                  </Box>
                )}

                {/* TAB 1: CREATE ACCOUNT FORM */}
                {tabIndex === 1 && (
                  <Box component="form" onSubmit={handleSignUp}>
                    <Stack spacing={2}>
                      <Grid container spacing={1.5}>
                        <Grid size={{ xs: 6 }}>
                          <TextField
                            fullWidth
                            label="First Name"
                            size="small"
                            value={signUpData.firstName}
                            onChange={(e) => setSignUpData({ ...signUpData, firstName: e.target.value })}
                            placeholder="John"
                          />
                        </Grid>
                        <Grid size={{ xs: 6 }}>
                          <TextField
                            fullWidth
                            label="Last Name"
                            size="small"
                            value={signUpData.lastName}
                            onChange={(e) => setSignUpData({ ...signUpData, lastName: e.target.value })}
                            placeholder="Doe"
                          />
                        </Grid>
                      </Grid>

                      <TextField
                        fullWidth
                        label="Email Address"
                        type="email"
                        required
                        size="small"
                        value={signUpData.email}
                        onChange={(e) => setSignUpData({ ...signUpData, email: e.target.value })}
                        placeholder="john.doe@example.com"
                      />

                      <TextField
                        fullWidth
                        label="Password (min. 6 characters)"
                        type={showSignUpPassword ? 'text' : 'password'}
                        required
                        size="small"
                        value={signUpData.password}
                        onChange={(e) => setSignUpData({ ...signUpData, password: e.target.value })}
                        placeholder="••••••••"
                        slotProps={{
                          input: {
                            endAdornment: (
                              <InputAdornment position="end">
                                <IconButton 
                                  onClick={() => setShowSignUpPassword(!showSignUpPassword)} 
                                  edge="end"
                                  size="small"
                                  sx={{ color: '#9CA3AF' }}
                                >
                                  {showSignUpPassword ? '👁️' : '🔒'}
                                </IconButton>
                              </InputAdornment>
                            ),
                          },
                        }}
                      />

                      <TextField
                        fullWidth
                        label="Confirm Password"
                        type={showSignUpPassword ? 'text' : 'password'}
                        required
                        size="small"
                        value={signUpData.confirmPassword}
                        onChange={(e) => setSignUpData({ ...signUpData, confirmPassword: e.target.value })}
                        placeholder="••••••••"
                      />

                      <Button
                        type="submit"
                        variant="contained"
                        size="large"
                        fullWidth
                        disabled={loading}
                        sx={{
                          py: 1.4,
                          fontSize: '0.95rem',
                          fontWeight: 700,
                          background: 'linear-gradient(135deg, #10B981 0%, #059669 100%)',
                          boxShadow: '0 4px 15px rgba(16, 185, 129, 0.4)',
                        }}
                      >
                        {loading ? (
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                            <CircularProgress size={20} color="inherit" />
                            <span>Creating Account...</span>
                          </Box>
                        ) : (
                          <span>⚡ Create Account & Sign In</span>
                        )}
                      </Button>
                    </Stack>
                  </Box>
                )}

                <Divider sx={{ my: 2.5, borderColor: 'rgba(255, 255, 255, 0.08)' }} />

                {/* Secondary Option */}
                <Button 
                  variant="text" 
                  fullWidth 
                  size="small"
                  onClick={onKeycloakSso}
                  sx={{ color: '#9CA3AF', fontSize: '0.8rem' }}
                >
                  🔐 Or Authenticate via Keycloak SSO Portal
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
