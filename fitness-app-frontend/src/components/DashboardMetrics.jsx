import React, { useMemo } from 'react';
import { Box, Card, CardContent, Typography, Grid2, LinearProgress } from '@mui/material';
import FitnessCenterRoundedIcon from '@mui/icons-material/FitnessCenterRounded';
import LocalFireDepartmentRoundedIcon from '@mui/icons-material/LocalFireDepartmentRounded';
import TimerRoundedIcon from '@mui/icons-material/TimerRounded';
import SpeedRoundedIcon from '@mui/icons-material/SpeedRounded';
import TrendingUpRoundedIcon from '@mui/icons-material/TrendingUpRounded';
import { formatDuration } from '../utils/activityUtils';

const DashboardMetrics = ({ activities = [] }) => {
  const stats = useMemo(() => {
    const totalWorkouts = activities.length;
    const totalCalories = activities.reduce((sum, a) => sum + (Number(a.caloriesBurned) || 0), 0);
    const totalMinutes = activities.reduce((sum, a) => sum + (Number(a.duration) || 0), 0);
    const avgDuration = totalWorkouts > 0 ? Math.round(totalMinutes / totalWorkouts) : 0;
    const avgCalories = totalWorkouts > 0 ? Math.round(totalCalories / totalWorkouts) : 0;

    // Filter activities from past 7 days
    const now = new Date();
    const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    const past7DaysActivities = activities.filter((a) => {
      const d = new Date(a.createdAt || a.startTime);
      return !isNaN(d.getTime()) && d >= sevenDaysAgo;
    });

    const weeklyMinutes = past7DaysActivities.reduce((sum, a) => sum + (Number(a.duration) || 0), 0);
    const weeklyGoal = 150; // standard WHO 150 min aerobic exercise / week
    const weeklyGoalPercent = Math.min(100, Math.round((weeklyMinutes / weeklyGoal) * 100));

    return {
      totalWorkouts,
      totalCalories,
      totalMinutes,
      avgDuration,
      avgCalories,
      weeklyMinutes,
      weeklyGoal,
      weeklyGoalPercent,
      recentCount: past7DaysActivities.length,
    };
  }, [activities]);

  const metricCards = [
    {
      id: 'workouts',
      title: 'Total Workouts',
      value: stats.totalWorkouts.toLocaleString(),
      subtext: `${stats.recentCount} logged this week`,
      icon: FitnessCenterRoundedIcon,
      color: '#10E760', // Lime
      gradient: 'linear-gradient(135deg, rgba(16, 231, 96, 0.2) 0%, rgba(16, 231, 96, 0.03) 100%)',
      borderColor: 'rgba(16, 231, 96, 0.25)',
      badge: stats.totalWorkouts > 0 ? 'Active' : 'Get Started',
    },
    {
      id: 'calories',
      title: 'Calories Burned',
      value: stats.totalCalories.toLocaleString(),
      unit: 'kcal',
      subtext: `~${stats.avgCalories} kcal / workout`,
      icon: LocalFireDepartmentRoundedIcon,
      color: '#FB923C', // Flame Orange
      gradient: 'linear-gradient(135deg, rgba(251, 146, 60, 0.2) 0%, rgba(251, 146, 60, 0.03) 100%)',
      borderColor: 'rgba(251, 146, 60, 0.25)',
      badge: 'Energy',
    },
    {
      id: 'minutes',
      title: 'Active Minutes',
      value: formatDuration(stats.totalMinutes),
      subtext: `${stats.weeklyMinutes}m in past 7 days`,
      icon: TimerRoundedIcon,
      color: '#38BDF8', // Electric Cyan
      gradient: 'linear-gradient(135deg, rgba(56, 189, 248, 0.2) 0%, rgba(56, 189, 248, 0.03) 100%)',
      borderColor: 'rgba(56, 189, 248, 0.25)',
      badge: `${stats.weeklyGoalPercent}% weekly goal`,
    },
    {
      id: 'avgDuration',
      title: 'Avg Workout Duration',
      value: `${stats.avgDuration}`,
      unit: 'min',
      subtext: 'Pace & stamina metric',
      icon: SpeedRoundedIcon,
      color: '#A855F7', // Violet
      gradient: 'linear-gradient(135deg, rgba(168, 85, 247, 0.2) 0%, rgba(168, 85, 247, 0.03) 100%)',
      borderColor: 'rgba(168, 85, 247, 0.25)',
      badge: 'Consistency',
    },
  ];

  return (
    <Box sx={{ mb: 4 }}>
      <Grid2 container spacing={2.5}>
        {metricCards.map((card) => {
          const Icon = card.icon;
          return (
            <Grid2 key={card.id} size={{ xs: 12, sm: 6, lg: 3 }}>
              <Card
                sx={{
                  position: 'relative',
                  overflow: 'hidden',
                  background: card.gradient,
                  border: `1px solid ${card.borderColor}`,
                  boxShadow: '0 8px 32px rgba(0, 0, 0, 0.35)',
                  backdropFilter: 'blur(16px)',
                  transition: 'transform 0.25s ease, box-shadow 0.25s ease, border-color 0.25s ease',
                  '&:hover': {
                    transform: 'translateY(-4px)',
                    boxShadow: `0 16px 36px rgba(0, 0, 0, 0.5), 0 0 20px ${card.color}25`,
                    borderColor: card.color,
                  },
                }}
              >
                {/* Decorative background glow circle */}
                <Box
                  sx={{
                    position: 'absolute',
                    top: -30,
                    right: -30,
                    width: 120,
                    height: 120,
                    borderRadius: '50%',
                    background: `radial-gradient(circle, ${card.color}20 0%, transparent 70%)`,
                    pointerEvents: 'none',
                  }}
                />

                <CardContent sx={{ p: 2.5, '&:last-child': { pb: 2.5 } }}>
                  {/* Top Row: Icon + Badge */}
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
                    <Box
                      sx={{
                        width: 44,
                        height: 44,
                        borderRadius: '12px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        bgcolor: `${card.color}15`,
                        color: card.color,
                        border: `1px solid ${card.color}35`,
                      }}
                    >
                      <Icon sx={{ fontSize: 24 }} />
                    </Box>

                    <Box
                      sx={{
                        px: 1.2,
                        py: 0.3,
                        borderRadius: '6px',
                        fontSize: '0.7rem',
                        fontWeight: 700,
                        letterSpacing: '0.03em',
                        bgcolor: 'rgba(255, 255, 255, 0.05)',
                        color: '#94A3B8',
                        border: '1px solid rgba(255, 255, 255, 0.08)',
                      }}
                    >
                      {card.badge}
                    </Box>
                  </Box>

                  {/* Value */}
                  <Typography
                    variant="caption"
                    sx={{
                      color: '#94A3B8',
                      fontWeight: 600,
                      textTransform: 'uppercase',
                      letterSpacing: '0.05em',
                      fontSize: '0.725rem',
                      display: 'block',
                      mb: 0.5,
                    }}
                  >
                    {card.title}
                  </Typography>

                  <Box sx={{ display: 'flex', alignItems: 'baseline', gap: 0.8, mb: 1 }}>
                    <Typography
                      variant="h4"
                      sx={{
                        fontWeight: 800,
                        color: '#F8FAFC',
                        letterSpacing: '-0.02em',
                        lineHeight: 1,
                      }}
                    >
                      {card.value}
                    </Typography>
                    {card.unit && (
                      <Typography
                        variant="body2"
                        sx={{ color: card.color, fontWeight: 700, fontSize: '0.85rem' }}
                      >
                        {card.unit}
                      </Typography>
                    )}
                  </Box>

                  {/* Subtext info */}
                  <Typography variant="body2" sx={{ color: '#64748B', fontSize: '0.8rem', fontWeight: 500 }}>
                    {card.subtext}
                  </Typography>
                </CardContent>
              </Card>
            </Grid2>
          );
        })}
      </Grid2>
    </Box>
  );
};

export default DashboardMetrics;
