import React, { useContext, useEffect, useState } from 'react';
import { BrowserRouter as Router, Navigate, Routes, Route } from 'react-router';
import { Box, Container, ThemeProvider, CssBaseline } from '@mui/material';
import { AuthContext } from 'react-oauth2-code-pkce';
import { useDispatch } from 'react-redux';
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
      {/* 4 Stats Summary Cards */}
      <StatsSummary activities={activities} />

      {/* Log Workout Form */}
      <ActivityForm onActivitiesAdded={fetchActivities} />

      {/* Activities Grid & Filters */}
      <ActivityList activities={activities} onActivityDeleted={handleActivityDeleted} />
    </Container>
  );
};

function App() {
  const { token, tokenData, logIn, logOut } = useContext(AuthContext);
  const dispatch = useDispatch();

  useEffect(() => {
    if (token) {
      dispatch(setCredentials({ token, user: tokenData }));
    }
  }, [token, tokenData, dispatch]);

  const handleLogout = () => {
    dispatch(logout());
    logOut();
  };

  return (
    <ThemeProvider theme={darkTheme}>
      <CssBaseline />
      <Router>
        {!token ? (
          <LoginHero onLogin={logIn} />
        ) : (
          <Box sx={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', backgroundColor: '#0B0F19' }}>
            <Navbar user={tokenData} onLogout={handleLogout} />
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
