import React, { useContext, useEffect, useState } from 'react';
import { BrowserRouter as Router, Navigate, Routes, Route } from 'react-router';
import { Box, Container, ThemeProvider, CssBaseline } from '@mui/material';
import { AuthContext } from 'react-oauth2-code-pkce';
import { useDispatch, useSelector } from 'react-redux';
import { setCredentials, logout } from './store/authSlice';
import { darkTheme } from './theme';

import Navbar from './components/Navbar';
import StatsSummary from './components/StatsSummary';
import ActivityForm from './components/ActivityForm';
import ActivityList from './components/ActivityList';
import ActivityDetail from './components/ActivityDetail';
import LoginHero from './components/LoginHero';
import { getActivities } from './services/api';

const Dashboard = () => {
  const [activities, setActivities] = useState([]);

  const fetchActivities = async () => {
    try {
      const response = await getActivities();
      setActivities(response.data || []);
    } catch (error) {
      console.error('Error fetching activities on dashboard:', error);
    }
  };

  useEffect(() => {
    fetchActivities();
  }, []);

  const handleActivityDeleted = (deletedId) => {
    setActivities(prev => prev.filter(act => act.id !== deletedId));
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* 4 Kinetic Stats Summary Cards */}
      <StatsSummary activities={activities} />

      {/* Athletic Log Workout Form */}
      <ActivityForm onActivitiesAdded={fetchActivities} />

      {/* Activities Grid & Filters */}
      <ActivityList activities={activities} onActivityDeleted={handleActivityDeleted} />
    </Container>
  );
};

function App() {
  const { token: pkceToken, tokenData: pkceTokenData, logIn: pkceLogIn } = useContext(AuthContext);
  const dispatch = useDispatch();
  
  const reduxToken = useSelector((state) => state.auth?.token);
  const reduxUser = useSelector((state) => state.auth?.user);

  const [inAppAuth, setInAppAuth] = useState({
    token: localStorage.getItem('token') || null,
    user: JSON.parse(localStorage.getItem('user') || 'null'),
  });

  // Sync PKCE token if authenticated via Keycloak redirect
  useEffect(() => {
    if (pkceToken) {
      dispatch(setCredentials({ token: pkceToken, user: pkceTokenData }));
      setInAppAuth({ token: pkceToken, user: pkceTokenData });
    }
  }, [pkceToken, pkceTokenData, dispatch]);

  const handleLogout = () => {
    dispatch(logout());
    localStorage.clear();
    setInAppAuth({ token: null, user: null });
    const keycloakLogoutUrl = `http://localhost:8181/realms/fitness-oauth2/protocol/openid-connect/logout?post_logout_redirect_uri=http://localhost:5173/&client_id=oauth2-pkce-client`;
    window.location.href = keycloakLogoutUrl;
  };

  const handleGoogleLogin = () => {
    try {
      pkceLogIn(undefined, { kc_idp_hint: 'google' });
    } catch (e) {
      console.error('Error initiating Google login:', e);
    }
  };

  const effectiveToken = pkceToken || reduxToken || inAppAuth.token;
  const effectiveUser = pkceTokenData || reduxUser || inAppAuth.user;

  return (
    <ThemeProvider theme={darkTheme}>
      <CssBaseline />
      <Router>
        {!effectiveToken ? (
          <LoginHero onGoogleLogin={handleGoogleLogin} />
        ) : (
          <Box sx={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', backgroundColor: '#0c0c0f' }}>
            <Navbar user={effectiveUser} onLogout={handleLogout} />
            <Box sx={{ flexGrow: 1 }}>
              <Routes>
                <Route path="/activities" element={<Dashboard />} />
                <Route path="/activities/:id" element={<ActivityDetail />} />
                <Route path="/" element={<Navigate to="/activities" replace />} />
                <Route path="*" element={<Navigate to="/activities" replace />} />
              </Routes>
            </Box>
          </Box>
        )}
      </Router>
    </ThemeProvider>
  );
}

export default App;
