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
    if (mins < 60) return `${mins}m`;
    const hrs = (mins / 60).toFixed(1);
    return `${hrs}h (${mins}m)`;
  };

  const statCards = [
    {
      title: 'Total Workouts',
      value: totalWorkouts,
      subtitle: totalWorkouts === 0 ? 'No workouts logged' : 'Recorded sessions',
      icon: '🏃‍♂️',
      gradient: 'linear-gradient(135deg, rgba(16, 185, 129, 0.15) 0%, rgba(5, 150, 105, 0.05) 100%)',
      borderColor: 'rgba(16, 185, 129, 0.3)',
      iconBg: 'rgba(16, 185, 129, 0.2)',
      textColor: '#10B981',
    },
    {
      title: 'Active Time',
      value: formatHours(totalMinutes),
      subtitle: totalWorkouts > 0 ? `~${Math.round(totalMinutes / totalWorkouts)} min / session` : 'Time spent exercising',
      icon: '⏱️',
      gradient: 'linear-gradient(135deg, rgba(6, 182, 212, 0.15) 0%, rgba(14, 165, 233, 0.05) 100%)',
      borderColor: 'rgba(6, 182, 212, 0.3)',
      iconBg: 'rgba(6, 182, 212, 0.2)',
      textColor: '#06B6D4',
    },
    {
      title: 'Calories Burned',
      value: `${totalCalories.toLocaleString()} kcal`,
      subtitle: totalWorkouts > 0 ? `~${Math.round(totalCalories / totalWorkouts)} kcal / workout` : 'Total energy expended',
      icon: '🔥',
      gradient: 'linear-gradient(135deg, rgba(249, 115, 22, 0.15) 0%, rgba(239, 68, 68, 0.05) 100%)',
      borderColor: 'rgba(249, 115, 22, 0.3)',
      iconBg: 'rgba(249, 115, 22, 0.2)',
      textColor: '#F97316',
    },
    {
      title: 'AI Coaching Insights',
      value: `${totalWorkouts} Insights`,
      subtitle: 'Powered by Gemini AI',
      icon: '🤖',
      gradient: 'linear-gradient(135deg, rgba(139, 92, 246, 0.15) 0%, rgba(109, 40, 217, 0.05) 100%)',
      borderColor: 'rgba(139, 92, 246, 0.3)',
      iconBg: 'rgba(139, 92, 246, 0.2)',
      textColor: '#8B5CF6',
    },
  ];

  return (
    <Grid container spacing={2} sx={{ mb: 4 }}>
      {statCards.map((card, idx) => (
        <Grid item xs={12} sm={6} md={3} key={idx}>
          <Card
            sx={{
              background: card.gradient,
              border: `1px solid ${card.borderColor}`,
              boxShadow: '0 8px 30px rgba(0, 0, 0, 0.2)',
              position: 'relative',
              overflow: 'hidden',
              '&:hover': {
                transform: 'translateY(-2px)',
                boxShadow: `0 12px 35px ${card.borderColor}`,
              }
            }}
          >
            <CardContent sx={{ p: 2.5, '&:last-child': { pb: 2.5 } }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <Box>
                  <Typography variant="caption" sx={{ color: '#9CA3AF', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                    {card.title}
                  </Typography>
                  <Typography variant="h4" sx={{ fontWeight: 800, mt: 0.5, color: '#F9FAFB' }}>
                    {card.value}
                  </Typography>
                  <Typography variant="caption" sx={{ color: card.textColor, mt: 0.5, display: 'block', fontWeight: 500 }}>
                    {card.subtitle}
                  </Typography>
                </Box>
                <Box
                  sx={{
                    width: 44,
                    height: 44,
                    borderRadius: '12px',
                    backgroundColor: card.iconBg,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '22px',
                    border: `1px solid ${card.borderColor}`
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
