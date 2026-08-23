import React from 'react';
import { AppBar, Toolbar, Typography, Box, Button, Avatar, Chip, Container } from '@mui/material';
import { useNavigate } from 'react-router';

const Navbar = ({ user, onLogout, onOpenLogModal }) => {
  const navigate = useNavigate();

  const getInitials = () => {
    if (!user) return 'U';
    if (user.given_name) return user.given_name.charAt(0).toUpperCase();
    if (user.preferred_username) return user.preferred_username.charAt(0).toUpperCase();
    return 'U';
  };

  const getDisplayName = () => {
    if (!user) return 'Athlete';
    if (user.given_name && user.family_name) return `${user.given_name} ${user.family_name}`;
    if (user.given_name) return user.given_name;
    if (user.preferred_username) return user.preferred_username;
    return 'Athlete';
  };

  return (
    <AppBar 
      position="sticky" 
      sx={{ 
        background: 'rgba(11, 15, 25, 0.85)', 
        backdropFilter: 'blur(20px)',
        borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
        boxShadow: '0 4px 20px rgba(0, 0, 0, 0.3)',
      }}
    >
      <Container maxWidth="lg">
        <Toolbar disableGutters sx={{ justifyContent: 'space-between', py: 1 }}>
          {/* Brand Logo */}
          <Box 
            onClick={() => navigate('/activities')} 
            sx={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: 1.5, 
              cursor: 'pointer',
              userSelect: 'none'
            }}
          >
            <Box 
              sx={{ 
                width: 42, 
                height: 42, 
                borderRadius: '12px',
                background: 'linear-gradient(135deg, #10B981 0%, #06B6D4 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '22px',
                boxShadow: '0 0 15px rgba(16, 185, 129, 0.5)',
              }}
            >
              ⚡
            </Box>
            <Box>
              <Typography 
                variant="h6" 
                sx={{ 
                  fontWeight: 800, 
                  lineHeight: 1.1,
                  background: 'linear-gradient(90deg, #FFFFFF 0%, #E5E7EB 50%, #10B981 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                }}
              >
                FitPulse <span style={{ color: '#10B981', WebkitTextFillColor: '#10B981' }}>AI</span>
              </Typography>
              <Chip 
                label="Microservices Hub" 
                size="small" 
                sx={{ 
                  height: 18, 
                  fontSize: '0.65rem', 
                  fontWeight: 700, 
                  backgroundColor: 'rgba(16, 185, 129, 0.15)',
                  color: '#10B981',
                  border: '1px solid rgba(16, 185, 129, 0.3)',
                  mt: 0.3
                }} 
              />
            </Box>
          </Box>

          {/* User Profile & Actions */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: { xs: 1, sm: 2 } }}>
            {/* User Profile Chip */}
            <Box 
              sx={{ 
                display: { xs: 'none', sm: 'flex' }, 
                alignItems: 'center', 
                gap: 1.2,
                px: 1.5,
                py: 0.75,
                borderRadius: '30px',
                backgroundColor: 'rgba(255, 255, 255, 0.05)',
                border: '1px solid rgba(255, 255, 255, 0.08)'
              }}
            >
              <Avatar 
                sx={{ 
                  width: 32, 
                  height: 32, 
                  bgcolor: '#10B981', 
                  fontWeight: 700,
                  fontSize: '0.85rem'
                }}
              >
                {getInitials()}
              </Avatar>
              <Box>
                <Typography variant="body2" sx={{ fontWeight: 600, color: '#F9FAFB', lineHeight: 1.1 }}>
                  {getDisplayName()}
                </Typography>
                <Typography variant="caption" sx={{ color: '#10B981', fontSize: '0.7rem', display: 'flex', alignItems: 'center', gap: 0.5 }}>
                  <span style={{ display: 'inline-block', width: 6, height: 6, borderRadius: '50%', backgroundColor: '#10B981' }}></span>
                  Authenticated
                </Typography>
              </Box>
            </Box>

            {/* Logout Button */}
            <Button 
              variant="outlined" 
              color="error" 
              size="small"
              onClick={onLogout}
              sx={{ 
                borderColor: 'rgba(239, 68, 68, 0.4)', 
                color: '#F87171',
                '&:hover': {
                  borderColor: '#EF4444',
                  backgroundColor: 'rgba(239, 68, 68, 0.1)'
                }
              }}
            >
              🚪 Sign Out
            </Button>
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
};

export default Navbar;
