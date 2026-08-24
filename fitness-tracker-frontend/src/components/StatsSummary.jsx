import React from 'react';
import { Grid, Card, CardContent, Typography, Box } from '@mui/material';

const StatsSummary = ({ activities = [] }) => {
  const totalWorkouts = activities.length;
  
  const totalMinutes = activities.reduce((sum, act) => {
    return sum + (Number(act.duration) || 0);
  }, 0);

  const totalCalories = activities.reduce((sum, act) => {
    return sum + (Number(act.calories || act.caloriesBurned) || 0);
  }, 0);

  const formatHours = (mins) => {
    if (mins < 60) return `${mins}M`;
    const hrs = (mins / 60).toFixed(1);
    return `${hrs}H`;
  };

  const statCards = [
    {
      title: 'TOTAL SESSIONS',
      value: totalWorkouts,
      unit: 'LOGS',
      subtitle: totalWorkouts === 0 ? 'NO ACTIVITY RECORDED' : 'EVENT STREAM ACTIVE',
      icon: '⚡',
      color: '#b4ff00', // Electric Lime
      bgGlow: 'rgba(180, 255, 0, 0.05)',
      borderColor: 'rgba(180, 255, 0, 0.25)',
    },
    {
      title: 'ACTIVE DURATION',
      value: formatHours(totalMinutes),
      unit: `(${totalMinutes} MINS)`,
      subtitle: totalWorkouts > 0 ? `~${Math.round(totalMinutes / totalWorkouts)} MIN AVG / SESSION` : 'TIME UNDER TENSION',
      icon: '⏱️',
      color: '#00d4ff', // Cyan
      bgGlow: 'rgba(0, 212, 255, 0.05)',
      borderColor: 'rgba(0, 212, 255, 0.25)',
    },
    {
      title: 'CALORIE EXPENDITURE',
      value: totalCalories.toLocaleString(),
      unit: 'KCAL',
      subtitle: totalWorkouts > 0 ? `~${Math.round(totalCalories / totalWorkouts)} KCAL AVG` : 'TOTAL ENERGY BURNOUT',
      icon: '🔥',
      color: '#ff4d00', // Hot Orange
      bgGlow: 'rgba(255, 77, 0, 0.05)',
      borderColor: 'rgba(255, 77, 0, 0.25)',
    },
    {
      title: 'AI COACH TELEMETRY',
      value: totalWorkouts,
      unit: 'REPORTS',
      subtitle: 'OPENROUTER NEURAL AGENT',
      icon: '🤖',
      color: '#a855f7', // Purple
      bgGlow: 'rgba(168, 85, 247, 0.05)',
      borderColor: 'rgba(168, 85, 247, 0.25)',
    },
  ];

  return (
    <Grid container spacing={2.5} sx={{ mb: 4 }}>
      {statCards.map((card, idx) => (
        <Grid size={{ xs: 12, sm: 6, md: 3 }} key={idx}>
          <Card
            sx={{
              backgroundColor: '#13131a',
              backgroundImage: `radial-gradient(ellipse at 100% 0%, ${card.bgGlow} 0%, transparent 70%)`,
              border: '1px solid rgba(255, 255, 255, 0.07)',
              borderRadius: '12px',
              position: 'relative',
              overflow: 'hidden',
              transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
              '&:hover': {
                transform: 'translateY(-2px)',
                borderColor: card.borderColor,
                boxShadow: `0 10px 30px ${card.bgGlow}`
              }
            }}
          >
            {/* Top Kinetic Color Bar */}
            <Box sx={{ height: 2, backgroundColor: card.color, width: '100%' }} />

            <CardContent sx={{ p: 2.8, '&:last-child': { pb: 2.8 } }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <Box>
                  <Typography 
                    variant="caption" 
                    sx={{ 
                      fontFamily: '"Barlow Condensed", sans-serif',
                      color: '#8888a0', 
                      fontWeight: 800, 
                      fontSize: '0.85rem',
                      letterSpacing: '0.06em'
                    }}
                  >
                    {card.title}
                  </Typography>

                  <Box sx={{ display: 'flex', alignItems: 'baseline', gap: 1, mt: 0.8 }}>
                    <Typography 
                      variant="h3" 
                      sx={{ 
                        fontFamily: '"JetBrains Mono", monospace',
                        fontWeight: 800, 
                        color: '#f4f4f7',
                        lineHeight: 1,
                        letterSpacing: '-0.03em'
                      }}
                    >
                      {card.value}
                    </Typography>
                    <Typography 
                      variant="caption" 
                      sx={{ 
                        fontFamily: '"JetBrains Mono", monospace',
                        color: card.color, 
                        fontWeight: 700, 
                        fontSize: '0.75rem',
                        letterSpacing: '0.04em'
                      }}
                    >
                      {card.unit}
                    </Typography>
                  </Box>

                  <Typography 
                    variant="caption" 
                    sx={{ 
                      fontFamily: '"JetBrains Mono", monospace',
                      color: '#8888a0', 
                      mt: 1.2, 
                      display: 'block', 
                      fontWeight: 600,
                      fontSize: '0.7rem',
                      letterSpacing: '0.02em'
                    }}
                  >
                    {card.subtitle}
                  </Typography>
                </Box>

                <Box
                  sx={{
                    width: 40,
                    height: 40,
                    borderRadius: '8px',
                    backgroundColor: 'rgba(255, 255, 255, 0.03)',
                    border: '1px solid rgba(255, 255, 255, 0.07)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '20px',
                  }}
                >
                  {card.icon}
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      ))}
    </Grid>
  );
};

export default StatsSummary;
