import React, { useMemo, useState } from 'react';
import {
  Box,
  Card,
  Typography,
  Grid2,
  ToggleButtonGroup,
  ToggleButton,
  LinearProgress,
  Tooltip,
} from '@mui/material';
import BarChartRoundedIcon from '@mui/icons-material/BarChartRounded';
import PieChartRoundedIcon from '@mui/icons-material/PieChartRounded';
import EmojiEventsRoundedIcon from '@mui/icons-material/EmojiEventsRounded';
import DirectionsRunRoundedIcon from '@mui/icons-material/DirectionsRunRounded';
import { ACTIVITY_CONFIGS, getActivityConfig, formatDuration } from '../utils/activityUtils';

const WeeklyAnalytics = ({ activities = [] }) => {
  const [metricMode, setMetricMode] = useState('duration'); // 'duration' or 'calories'

  // Calculate day-by-day stats for the past 7 days (or Mon-Sun)
  const analyticsData = useMemo(() => {
    const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const today = new Date();

    // Generate past 7 days starting 6 days ago up to today
    const past7Days = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date(today);
      d.setDate(today.getDate() - i);
      d.setHours(0, 0, 0, 0);
      past7Days.push({
        date: d,
        dayLabel: i === 0 ? 'Today' : dayNames[d.getDay()],
        dateLabel: d.toLocaleDateString(undefined, { month: 'numeric', day: 'numeric' }),
        duration: 0,
        calories: 0,
        count: 0,
        activitiesList: [],
      });
    }

    // Aggregate backend activities into their respective days
    activities.forEach((activity) => {
      const actDate = new Date(activity.createdAt || activity.startTime);
      if (isNaN(actDate.getTime())) return;

      actDate.setHours(0, 0, 0, 0);
      const dayMatch = past7Days.find(
        (slot) => slot.date.getTime() === actDate.getTime()
      );

      if (dayMatch) {
        dayMatch.duration += Number(activity.duration) || 0;
        dayMatch.calories += Number(activity.caloriesBurned) || 0;
        dayMatch.count += 1;
        dayMatch.activitiesList.push(activity);
      }
    });

    // Breakdown by activity type
    const typeCounts = {};
    let totalTypeDuration = 0;
    activities.forEach((act) => {
      const type = (act.type || 'OTHER').toUpperCase();
      const dur = Number(act.duration) || 0;
      if (!typeCounts[type]) {
        typeCounts[type] = { count: 0, duration: 0, calories: 0 };
      }
      typeCounts[type].count += 1;
      typeCounts[type].duration += dur;
      typeCounts[type].calories += Number(act.caloriesBurned) || 0;
      totalTypeDuration += dur;
    });

    const typeBreakdown = Object.entries(typeCounts)
      .map(([type, data]) => ({
        type,
        ...data,
        percentage: totalTypeDuration > 0 ? Math.round((data.duration / totalTypeDuration) * 100) : 0,
        config: getActivityConfig(type),
      }))
      .sort((a, b) => b.duration - a.duration);

    // Goal stats (150 min aerobic goal per week)
    const weekDuration = past7Days.reduce((sum, d) => sum + d.duration, 0);
    const weekCalories = past7Days.reduce((sum, d) => sum + d.calories, 0);
    const weeklyGoalTarget = 150;
    const goalPercent = Math.min(100, Math.round((weekDuration / weeklyGoalTarget) * 100));

    // Peak metric for bar scaling
    const maxDayValue = Math.max(
      ...past7Days.map((d) => (metricMode === 'duration' ? d.duration : d.calories)),
      metricMode === 'duration' ? 60 : 500
    );

    return {
      past7Days,
      typeBreakdown,
      weekDuration,
      weekCalories,
      weeklyGoalTarget,
      goalPercent,
      maxDayValue,
    };
  }, [activities, metricMode]);

  return (
    <Box sx={{ mb: 4 }}>
      <Grid2 container spacing={2.5}>
        {/* Left Column: Weekly Activity Bar Chart */}
        <Grid2 size={{ xs: 12, lg: 8 }}>
          <Card
            sx={{
              p: { xs: 2.5, sm: 3 },
              height: '100%',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
            }}
          >
            {/* Header & Metric Switcher */}
            <Box
              sx={{
                display: 'flex',
                flexDirection: { xs: 'column', sm: 'row' },
                justifyContent: 'space-between',
                alignItems: { xs: 'flex-start', sm: 'center' },
                gap: 1.5,
                mb: 3,
              }}
            >
              <Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <BarChartRoundedIcon sx={{ color: '#10E760', fontSize: 22 }} />
                  <Typography variant="h6" sx={{ fontWeight: 700, color: '#F8FAFC' }}>
                    Weekly Workout Analytics
                  </Typography>
                </Box>
                <Typography variant="caption" sx={{ color: '#94A3B8' }}>
                  {metricMode === 'duration'
                    ? `Total: ${formatDuration(analyticsData.weekDuration)} active in past 7 days`
                    : `Total: ${analyticsData.weekCalories.toLocaleString()} kcal burned in past 7 days`}
                </Typography>
              </Box>

              <ToggleButtonGroup
                value={metricMode}
                exclusive
                onChange={(e, val) => val && setMetricMode(val)}
                size="small"
                sx={{
                  bgcolor: 'rgba(255, 255, 255, 0.04)',
                  p: 0.4,
                  borderRadius: '10px',
                  border: '1px solid rgba(255, 255, 255, 0.08)',
                  '& .MuiToggleButton-root': {
                    border: 'none',
                    borderRadius: '8px',
                    color: '#94A3B8',
                    px: 1.6,
                    py: 0.5,
                    fontSize: '0.75rem',
                    fontWeight: 600,
                    textTransform: 'none',
                    '&.Mui-selected': {
                      bgcolor: '#10E760',
                      color: '#06170B',
                      fontWeight: 700,
                      '&:hover': { bgcolor: '#00D650' },
                    },
                  },
                }}
              >
                <ToggleButton value="duration">Minutes</ToggleButton>
                <ToggleButton value="calories">Calories</ToggleButton>
              </ToggleButtonGroup>
            </Box>

            {/* Interactive Bar Chart Visualization */}
            <Box sx={{ width: '100%', pt: 2, pb: 1 }}>
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'flex-end',
                  justifyContent: 'space-between',
                  height: 200,
                  gap: { xs: 1, sm: 2 },
                  px: 1,
                  borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
                }}
              >
                {analyticsData.past7Days.map((day, idx) => {
                  const val = metricMode === 'duration' ? day.duration : day.calories;
                  const barHeightPercent = Math.max(
                    val > 0 ? (val / analyticsData.maxDayValue) * 100 : 4,
                    val > 0 ? 8 : 3
                  );
                  const isToday = day.dayLabel === 'Today';

                  const tooltipTitle = (
                    <Box sx={{ p: 0.5 }}>
                      <Typography variant="subtitle2" sx={{ fontWeight: 700, color: '#10E760' }}>
                        {day.dayLabel} ({day.dateLabel})
                      </Typography>
                      <Typography variant="body2" sx={{ color: '#F8FAFC' }}>
                        Duration: {day.duration} mins
                      </Typography>
                      <Typography variant="body2" sx={{ color: '#FB923C' }}>
                        Calories: {day.calories} kcal
                      </Typography>
                      <Typography variant="caption" sx={{ color: '#94A3B8' }}>
                        {day.count} {day.count === 1 ? 'activity' : 'activities'}
                      </Typography>
                    </Box>
                  );

                  return (
                    <Tooltip key={idx} title={tooltipTitle} arrow placement="top">
                      <Box
                        sx={{
                          flex: 1,
                          height: '100%',
                          display: 'flex',
                          flexDirection: 'column',
                          justifyContent: 'flex-end',
                          alignItems: 'center',
                          cursor: 'pointer',
                          group: 'bar',
                          '&:hover .bar-pillar': {
                            filter: 'brightness(1.25)',
                            transform: 'scaleY(1.03)',
                          },
                        }}
                      >
                        {/* Value label above bar if non-zero */}
                        {val > 0 && (
                          <Typography
                            variant="caption"
                            sx={{
                              color: isToday ? '#10E760' : '#94A3B8',
                              fontWeight: 700,
                              fontSize: '0.7rem',
                              mb: 0.5,
                              display: { xs: 'none', sm: 'block' },
                            }}
                          >
                            {val}
                          </Typography>
                        )}

                        {/* Animated Bar Pillar */}
                        <Box
                          className="bar-pillar"
                          sx={{
                            width: '100%',
                            maxWidth: 38,
                            height: `${barHeightPercent}%`,
                            borderRadius: '8px 8px 3px 3px',
                            background:
                              val > 0
                                ? isToday
                                  ? 'linear-gradient(180deg, #10E760 0%, #00B843 100%)'
                                  : 'linear-gradient(180deg, #38BDF8 0%, #0284C7 100%)'
                                : 'rgba(255, 255, 255, 0.05)',
                            boxShadow:
                              val > 0
                                ? isToday
                                  ? '0 0 16px rgba(16, 231, 96, 0.4)'
                                  : '0 0 12px rgba(56, 189, 248, 0.25)'
                                : 'none',
                            transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                            transformOrigin: 'bottom',
                          }}
                        />
                      </Box>
                    </Tooltip>
                  );
                })}
              </Box>

              {/* Day Labels Row */}
              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  px: 1,
                  pt: 1.5,
                }}
              >
                {analyticsData.past7Days.map((day, idx) => (
                  <Box key={idx} sx={{ flex: 1, textAlign: 'center' }}>
                    <Typography
                      variant="caption"
                      sx={{
                        fontWeight: day.dayLabel === 'Today' ? 700 : 500,
                        color: day.dayLabel === 'Today' ? '#10E760' : '#94A3B8',
                        fontSize: '0.75rem',
                        display: 'block',
                      }}
                    >
                      {day.dayLabel}
                    </Typography>
                    <Typography
                      variant="caption"
                      sx={{
                        color: '#64748B',
                        fontSize: '0.65rem',
                        display: { xs: 'none', sm: 'block' },
                      }}
                    >
                      {day.dateLabel}
                    </Typography>
                  </Box>
                ))}
              </Box>
            </Box>
          </Card>
        </Grid2>

        {/* Right Column: Goal Progress Ring & Activity Distribution */}
        <Grid2 size={{ xs: 12, lg: 4 }}>
          <Card
            sx={{
              p: { xs: 2.5, sm: 3 },
              height: '100%',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              gap: 3,
            }}
          >
            {/* Weekly Target Progress */}
            <Box>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <EmojiEventsRoundedIcon sx={{ color: '#F59E0B', fontSize: 22 }} />
                  <Typography variant="h6" sx={{ fontWeight: 700, color: '#F8FAFC' }}>
                    Weekly Goal
                  </Typography>
                </Box>
                <Typography
                  variant="caption"
                  sx={{
                    px: 1,
                    py: 0.3,
                    borderRadius: '6px',
                    bgcolor: 'rgba(245, 158, 11, 0.1)',
                    color: '#F59E0B',
                    fontWeight: 700,
                    border: '1px solid rgba(245, 158, 11, 0.25)',
                  }}
                >
                  {analyticsData.goalPercent}% Complete
                </Typography>
              </Box>

              {/* Goal Progress Ring / Bar */}
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 2.5,
                  p: 2,
                  borderRadius: '14px',
                  bgcolor: 'rgba(11, 18, 32, 0.7)',
                  border: '1px solid rgba(255, 255, 255, 0.06)',
                }}
              >
                {/* SVG Progress Circle */}
                <Box sx={{ position: 'relative', width: 72, height: 72, flexShrink: 0 }}>
                  <svg width="72" height="72" viewBox="0 0 72 72">
                    <circle
                      cx="36"
                      cy="36"
                      r="28"
                      fill="none"
                      stroke="rgba(255, 255, 255, 0.08)"
                      strokeWidth="6"
                    />
                    <circle
                      cx="36"
                      cy="36"
                      r="28"
                      fill="none"
                      stroke="#10E760"
                      strokeWidth="6"
                      strokeLinecap="round"
                      strokeDasharray={2 * Math.PI * 28}
                      strokeDashoffset={2 * Math.PI * 28 * (1 - analyticsData.goalPercent / 100)}
                      transform="rotate(-90 36 36)"
                      style={{ transition: 'stroke-dashoffset 0.8s ease-in-out' }}
                    />
                  </svg>
                  <Box
                    sx={{
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      right: 0,
                      bottom: 0,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <Typography variant="caption" sx={{ fontWeight: 800, color: '#10E760', fontSize: '0.8rem' }}>
                      {analyticsData.goalPercent}%
                    </Typography>
                  </Box>
                </Box>

                <Box sx={{ flexGrow: 1 }}>
                  <Typography variant="body2" sx={{ fontWeight: 700, color: '#F8FAFC', mb: 0.3 }}>
                    WHO Activity Target
                  </Typography>
                  <Typography variant="caption" sx={{ color: '#94A3B8', display: 'block', mb: 1 }}>
                    {analyticsData.weekDuration} of {analyticsData.weeklyGoalTarget} mins achieved
                  </Typography>
                  <LinearProgress
                    variant="determinate"
                    value={analyticsData.goalPercent}
                    sx={{
                      height: 6,
                      borderRadius: 3,
                      bgcolor: 'rgba(255, 255, 255, 0.08)',
                      '& .MuiLinearProgress-bar': {
                        bgcolor: '#10E760',
                        borderRadius: 3,
                      },
                    }}
                  />
                </Box>
              </Box>
            </Box>

            {/* Activity Type Breakdown */}
            <Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1.5 }}>
                <PieChartRoundedIcon sx={{ color: '#38BDF8', fontSize: 20 }} />
                <Typography variant="subtitle2" sx={{ fontWeight: 700, color: '#F8FAFC' }}>
                  Top Disciplines
                </Typography>
              </Box>

              {analyticsData.typeBreakdown.length === 0 ? (
                <Typography variant="caption" sx={{ color: '#64748B', fontStyle: 'italic' }}>
                  Log activities to see your distribution breakdown
                </Typography>
              ) : (
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.2 }}>
                  {analyticsData.typeBreakdown.slice(0, 4).map((item) => {
                    const Icon = item.config.icon;
                    return (
                      <Box key={item.type}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.4 }}>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.8 }}>
                            <Icon sx={{ fontSize: 16, color: item.config.color }} />
                            <Typography variant="caption" sx={{ fontWeight: 600, color: '#F1F5F9' }}>
                              {item.config.label}
                            </Typography>
                          </Box>
                          <Typography variant="caption" sx={{ color: '#94A3B8', fontWeight: 600 }}>
                            {item.duration}m ({item.percentage}%)
                          </Typography>
                        </Box>
                        <LinearProgress
                          variant="determinate"
                          value={item.percentage}
                          sx={{
                            height: 5,
                            borderRadius: 2.5,
                            bgcolor: 'rgba(255, 255, 255, 0.06)',
                            '& .MuiLinearProgress-bar': {
                              bgcolor: item.config.color,
                              borderRadius: 2.5,
                            },
                          }}
                        />
                      </Box>
                    );
                  })}
                </Box>
              )}
            </Box>
          </Card>
        </Grid2>
      </Grid2>
    </Box>
  );
};

export default WeeklyAnalytics;
