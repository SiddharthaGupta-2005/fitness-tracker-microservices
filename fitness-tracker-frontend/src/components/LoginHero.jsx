import React from 'react';
import { Box, Button, Container, Typography, Grid, Card, CardContent, Chip, Paper } from '@mui/material';

const LoginHero = ({ onLogin }) => {
  const features = [
    {
      icon: '🤖',
      title: 'Real-Time Gemini AI Coaching',
      description: 'Instant analysis of workout intensity, pacing metrics, cadence, and personalized recovery advice.',
      color: '#8B5CF6'
    },
    {
      icon: '⚡',
      title: 'Event-Driven Microservices',
      description: 'Spring Cloud Gateway, Eureka Service Registry, and RabbitMQ message queues for non-blocking processing.',
      color: '#10B981'
    },
    {
      icon: '🔒',
      title: 'Keycloak OAuth2 & PKCE',
      description: 'Enterprise-grade identity security, JWT tokens, and automated reactive user profile synchronization.',
      color: '#06B6D4'
    },
    {
      icon: '🗄️',
      title: 'Polyglot Persistence',
      description: 'PostgreSQL for relational user accounts and MongoDB for high-velocity activity logs & AI recommendations.',
      color: '#F59E0B'
    }
  ];

  return (
    <Box 
      sx={{ 
        minHeight: '100vh', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center',
        background: 'radial-gradient(ellipse at top, #111827, #0B0F19)',
        py: { xs: 6, md: 10 },
        px: 2
      }}
    >
      <Container maxWidth="lg">
        {/* Main Hero Header */}
        <Box sx={{ textAlign: 'center', maxWidth: 800, mx: 'auto', mb: 6 }}>
          <Chip 
            label="⚡ Microservices + Generative AI Hub" 
            sx={{ 
              backgroundColor: 'rgba(16, 185, 129, 0.15)', 
              color: '#10B981', 
              border: '1px solid rgba(16, 185, 129, 0.3)',
              fontWeight: 700,
              mb: 2.5,
              px: 1
            }} 
          />
          
          <Typography 
            variant="h2" 
            sx={{ 
              fontWeight: 800, 
              fontSize: { xs: '2.5rem', sm: '3.5rem', md: '4rem' },
              lineHeight: 1.15,
              mb: 2.5,
              background: 'linear-gradient(135deg, #FFFFFF 0%, #D1D5DB 40%, #10B981 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}
          >
            Track Workouts. Unlock AI Insights.
          </Typography>

          <Typography 
            variant="h6" 
            sx={{ 
              color: '#9CA3AF', 
              fontWeight: 400, 
              lineHeight: 1.6,
              mb: 4,
              fontSize: { xs: '1rem', sm: '1.2rem' }
            }}
          >
            A full-stack event-driven fitness tracking ecosystem built with Spring Cloud, RabbitMQ, MongoDB, PostgreSQL, and Google Gemini AI.
          </Typography>

          {/* Glowing Sign In Button */}
          <Button
            variant="contained"
            size="large"
            onClick={onLogin}
            sx={{
              py: 1.8,
              px: 5,
              fontSize: '1.15rem',
              fontWeight: 700,
              borderRadius: 3,
              background: 'linear-gradient(135deg, #10B981 0%, #059669 100%)',
              boxShadow: '0 0 25px rgba(16, 185, 129, 0.4)',
              '&:hover': {
                background: 'linear-gradient(135deg, #34D399 0%, #10B981 100%)',
                boxShadow: '0 0 35px rgba(16, 185, 129, 0.7)',
                transform: 'scale(1.03)',
              }
            }}
          >
            🚀 Sign In with Keycloak
          </Button>
        </Box>

        {/* 4 Architecture Pillars */}
        <Grid container spacing={3} sx={{ mt: 2 }}>
          {features.map((feat, idx) => (
            <Grid item xs={12} sm={6} md={3} key={idx}>
              <Card 
                sx={{ 
                  height: '100%', 
                  background: 'rgba(17, 24, 39, 0.7)', 
                  border: `1px solid ${feat.color}30`,
                  p: 1,
                  transition: 'all 0.25s ease',
                  '&:hover': {
                    transform: 'translateY(-4px)',
                    boxShadow: `0 10px 30px ${feat.color}25`,
                    borderColor: feat.color,
                  }
                }}
              >
                <CardContent>
                  <Box 
                    sx={{ 
                      width: 48, 
                      height: 48, 
                      borderRadius: 2.5, 
                      backgroundColor: `${feat.color}20`,
                      border: `1px solid ${feat.color}40`,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '24px',
                      mb: 2
                    }}
                  >
                    {feat.icon}
                  </Box>
                  <Typography variant="h6" sx={{ fontWeight: 700, color: '#F9FAFB', mb: 1, fontSize: '1.05rem' }}>
                    {feat.title}
                  </Typography>
                  <Typography variant="body2" sx={{ color: '#9CA3AF', lineHeight: 1.6 }}>
                    {feat.description}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
  );
};

export default LoginHero;
