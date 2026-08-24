import React from 'react';
import { AppBar, Toolbar, Typography, Box, Button, Avatar, Chip, Container } from '@mui/material';
import { useNavigate } from 'react-router';

const Navbar = ({ user, onLogout }) => {
  const navigate = useNavigate();

  const getInitials = () => {
    if (!user) return 'A';
    if (user.given_name) return user.given_name.charAt(0).toUpperCase();
    if (user.preferred_username) return user.preferred_username.charAt(0).toUpperCase();
    return 'A';
  };

  const getDisplayName = () => {
    if (!user) return 'ATHLETE';
    if (user.given_name && user.family_name) return `${user.given_name} ${user.family_name}`.toUpperCase();
    if (user.given_name) return user.given_name.toUpperCase();
    if (user.preferred_username) return user.preferred_username.toUpperCase();
    return 'ATHLETE';
  };

  return (
    <AppBar 
      position="sticky" 
      sx={{ 
        background: 'rgba(12, 12, 15, 0.9)', 
        backdropFilter: 'blur(20px)',
        borderBottom: '1px solid rgba(255, 255, 255, 0.07)',
        boxShadow: '0 4px 25px rgba(0, 0, 0, 0.6)',
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
                width: 38, 
                height: 38, 
                borderRadius: '8px',
                backgroundColor: '#b4ff00',
                color: '#0c0c0f',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '20px',
                fontWeight: 900,
                boxShadow: '0 0 20px rgba(180, 255, 0, 0.35)',
              }}
            >
              ⚡
            </Box>
            <Box>
              <Typography 
                variant="h5" 
                sx={{ 
                  fontFamily: '"Barlow Condensed", sans-serif',
                  fontWeight: 900, 
                  letterSpacing: '0.04em',
                  lineHeight: 1,
                  color: '#f4f4f7'
                }}
              >
                FITPULSE <span style={{ color: '#b4ff00' }}>AI</span>
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.8, mt: 0.3 }}>
                <span style={{ width: 6, height: 6, borderRadius: '50%', backgroundColor: '#b4ff00', display: 'inline-block', boxShadow: '0 0 8px #b4ff00' }}></span>
                <Typography 
                  variant="caption" 
                  sx={{ 
                    fontFamily: '"JetBrains Mono", monospace',
                    fontSize: '0.65rem', 
                    fontWeight: 700, 
                    color: '#8888a0',
                    letterSpacing: '0.05em'
                  }}
                >
                  LIVE TELEMETRY
                </Typography>
              </Box>
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
                px: 1.8,
                py: 0.6,
                borderRadius: '8px',
                backgroundColor: '#13131a',
                border: '1px solid rgba(255, 255, 255, 0.07)'
              }}
            >
              <Avatar 
                sx={{ 
                  width: 28, 
                  height: 28, 
                  bgcolor: '#b4ff00', 
                  color: '#0c0c0f',
                  fontWeight: 800,
                  fontSize: '0.8rem',
                  fontFamily: '"JetBrains Mono", monospace'
                }}
              >
                {getInitials()}
              </Avatar>
              <Box>
                <Typography 
                  variant="caption" 
                  sx={{ 
                    fontFamily: '"Barlow Condensed", sans-serif',
                    fontWeight: 800, 
                    color: '#f4f4f7', 
                    fontSize: '0.85rem',
                    letterSpacing: '0.04em',
                    lineHeight: 1.1,
                    display: 'block'
                  }}
                >
                  {getDisplayName()}
                </Typography>
                <Typography 
                  variant="caption" 
                  sx={{ 
                    fontFamily: '"JetBrains Mono", monospace',
                    color: '#b4ff00', 
                    fontSize: '0.65rem', 
                    display: 'flex', 
                    alignItems: 'center', 
                    gap: 0.5 
                  }}
                >
                  OAUTH2 VERIFIED
                </Typography>
              </Box>
            </Box>

            {/* Logout Button */}
            <Button 
              variant="outlined" 
              size="small"
              onClick={onLogout}
              sx={{ 
                borderColor: 'rgba(255, 77, 0, 0.3)', 
                color: '#ff4d00',
                fontFamily: '"Barlow Condensed", sans-serif',
                fontWeight: 800,
                fontSize: '0.85rem',
                letterSpacing: '0.04em',
                px: 2,
                py: 0.6,
                '&:hover': {
                  borderColor: '#ff4d00',
                  backgroundColor: 'rgba(255, 77, 0, 0.1)',
                  boxShadow: '0 0 15px rgba(255, 77, 0, 0.2)'
                }
              }}
            >
              SIGN OUT
            </Button>
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
};

export default Navbar;
