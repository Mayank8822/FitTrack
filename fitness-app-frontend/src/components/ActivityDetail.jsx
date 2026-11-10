import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router';
import { getActivity, getActivityDetail } from '../services/api';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  Grid2,
  Chip,
  Skeleton,
  Divider,
  Alert,
} from '@mui/material';
import ArrowBackRoundedIcon from '@mui/icons-material/ArrowBackRounded';
import AutoAwesomeRoundedIcon from '@mui/icons-material/AutoAwesomeRounded';
import TimerRoundedIcon from '@mui/icons-material/TimerRounded';
import LocalFireDepartmentRoundedIcon from '@mui/icons-material/LocalFireDepartmentRounded';
import CalendarMonthRoundedIcon from '@mui/icons-material/CalendarMonthRounded';
import CheckCircleRoundedIcon from '@mui/icons-material/CheckCircleRounded';
import LightbulbRoundedIcon from '@mui/icons-material/LightbulbRounded';
import ShieldRoundedIcon from '@mui/icons-material/ShieldRounded';
import HourglassEmptyRoundedIcon from '@mui/icons-material/HourglassEmptyRounded';
import ActivitiesPageHeader from './ActivitiesPageHeader';
import { getActivityConfig } from '../utils/activityUtils';

const ActivityDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [activity, setActivity] = useState(null);
  const [recommendation, setRecommendation] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let isMounted = true;

    const fetchData = async () => {
      setLoading(true);
      setError('');

      try {
        // Fetch activity info and AI recommendation in parallel
        const [activityRes, recRes] = await Promise.allSettled([
          getActivity(id),
          getActivityDetail(id),
        ]);

        if (!isMounted) return;

        if (activityRes.status === 'fulfilled') {
          setActivity(activityRes.value.data);
        }

        if (recRes.status === 'fulfilled' && recRes.value?.data) {
          setRecommendation(recRes.value.data);
          // If activityRes failed but recommendation has basic activityType
          if (activityRes.status !== 'fulfilled') {
            setActivity({
              id,
              type: recRes.value.data.activityType || 'OTHER',
              createdAt: recRes.value.data.createdAt,
            });
          }
        } else if (activityRes.status !== 'fulfilled') {
          setError('Workout session not found or failed to load.');
        }
      } catch (err) {
        console.error('Error fetching activity details:', err);
        if (isMounted) {
          setError('Unable to load workout details. Please try again.');
        }
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchData();

    return () => {
      isMounted = false;
    };
  }, [id]);

  const activityType = activity?.type || recommendation?.activityType || 'OTHER';
  const config = getActivityConfig(activityType);
  const TypeIcon = config.icon;

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: '#070B14', pb: 8 }}>
      <ActivitiesPageHeader onOpenAddModal={() => navigate('/activities')} />

      <Box sx={{ maxWidth: 1000, mx: 'auto', px: { xs: 2, sm: 3 }, pt: 3 }}>
        {/* Back Button */}
        <Button
          startIcon={<ArrowBackRoundedIcon />}
          onClick={() => navigate('/activities')}
          sx={{
            mb: 3,
            color: '#94A3B8',
            bgcolor: 'rgba(255, 255, 255, 0.04)',
            border: '1px solid rgba(255, 255, 255, 0.08)',
            px: 2,
            py: 0.8,
            borderRadius: '10px',
            '&:hover': {
              color: '#10E760',
              borderColor: 'rgba(16, 231, 96, 0.3)',
              bgcolor: 'rgba(16, 231, 96, 0.08)',
            },
          }}
        >
          Back to Workouts
        </Button>

        {error && (
          <Alert severity="error" sx={{ mb: 3, borderRadius: '14px' }}>
            {error}
          </Alert>
        )}

        {loading ? (
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
            <Skeleton variant="rounded" height={180} sx={{ borderRadius: '20px', bgcolor: 'rgba(255, 255, 255, 0.06)' }} />
            <Skeleton variant="rounded" height={260} sx={{ borderRadius: '20px', bgcolor: 'rgba(255, 255, 255, 0.06)' }} />
          </Box>
        ) : activity ? (
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
            {/* Workout Overview Hero Card */}
            <Card
              sx={{
                p: { xs: 2.5, sm: 3.5 },
                position: 'relative',
                overflow: 'hidden',
                background: `linear-gradient(135deg, rgba(15, 23, 42, 0.9) 0%, rgba(20, 30, 51, 0.95) 100%)`,
                border: `1px solid rgba(255, 255, 255, 0.1)`,
              }}
            >
              {/* Background Glow */}
              <Box
                sx={{
                  position: 'absolute',
                  top: -40,
                  right: -40,
                  width: 200,
                  height: 200,
                  borderRadius: '50%',
                  background: `radial-gradient(circle, ${config.color}25 0%, transparent 70%)`,
                  pointerEvents: 'none',
                }}
              />

              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
                <Box
                  sx={{
                    width: 56,
                    height: 56,
                    borderRadius: '16px',
                    bgcolor: config.bgGlow,
                    color: config.color,
                    border: `1px solid ${config.borderGlow}`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    boxShadow: `0 0 20px ${config.color}30`,
                  }}
                >
                  <TypeIcon sx={{ fontSize: 32 }} />
                </Box>
                <Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                    <Typography variant="h4" sx={{ fontWeight: 800, color: '#F8FAFC' }}>
                      {config.label} Session
                    </Typography>
                    <Chip
                      label="Logged"
                      size="small"
                      sx={{
                        bgcolor: 'rgba(16, 231, 96, 0.15)',
                        color: '#10E760',
                        fontWeight: 700,
                        border: '1px solid rgba(16, 231, 96, 0.3)',
                      }}
                    />
                  </Box>
                  <Typography variant="body2" sx={{ color: '#94A3B8', mt: 0.3 }}>
                    Session ID: {activity.id || id}
                  </Typography>
                </Box>
              </Box>

              {/* Stats Highlights */}
              <Grid2 container spacing={2}>
                <Grid2 size={{ xs: 12, sm: 4 }}>
                  <Box
                    sx={{
                      p: 2,
                      borderRadius: '14px',
                      bgcolor: 'rgba(11, 18, 32, 0.7)',
                      border: '1px solid rgba(255, 255, 255, 0.06)',
                      display: 'flex',
                      alignItems: 'center',
                      gap: 1.5,
                    }}
                  >
                    <TimerRoundedIcon sx={{ color: '#38BDF8', fontSize: 28 }} />
                    <Box>
                      <Typography variant="caption" sx={{ color: '#94A3B8' }}>
                        Duration
                      </Typography>
                      <Typography variant="h6" sx={{ fontWeight: 700, color: '#F8FAFC' }}>
                        {activity.duration || 0} minutes
                      </Typography>
                    </Box>
                  </Box>
                </Grid2>

                <Grid2 size={{ xs: 12, sm: 4 }}>
                  <Box
                    sx={{
                      p: 2,
                      borderRadius: '14px',
                      bgcolor: 'rgba(11, 18, 32, 0.7)',
                      border: '1px solid rgba(255, 255, 255, 0.06)',
                      display: 'flex',
                      alignItems: 'center',
                      gap: 1.5,
                    }}
                  >
                    <LocalFireDepartmentRoundedIcon sx={{ color: '#FB923C', fontSize: 28 }} />
                    <Box>
                      <Typography variant="caption" sx={{ color: '#94A3B8' }}>
                        Energy Burned
                      </Typography>
                      <Typography variant="h6" sx={{ fontWeight: 700, color: '#F8FAFC' }}>
                        {activity.caloriesBurned || 0} kcal
                      </Typography>
                    </Box>
                  </Box>
                </Grid2>

                <Grid2 size={{ xs: 12, sm: 4 }}>
                  <Box
                    sx={{
                      p: 2,
                      borderRadius: '14px',
                      bgcolor: 'rgba(11, 18, 32, 0.7)',
                      border: '1px solid rgba(255, 255, 255, 0.06)',
                      display: 'flex',
                      alignItems: 'center',
                      gap: 1.5,
                    }}
                  >
                    <CalendarMonthRoundedIcon sx={{ color: '#A855F7', fontSize: 28 }} />
                    <Box>
                      <Typography variant="caption" sx={{ color: '#94A3B8' }}>
                        Date & Time
                      </Typography>
                      <Typography variant="body2" sx={{ fontWeight: 700, color: '#F8FAFC' }}>
                        {activity.createdAt
                          ? new Date(activity.createdAt).toLocaleString(undefined, {
                              dateStyle: 'medium',
                              timeStyle: 'short',
                            })
                          : 'Recorded recently'}
                      </Typography>
                    </Box>
                  </Box>
                </Grid2>
              </Grid2>
            </Card>

            {/* AI Recommendation Insights Card */}
            {recommendation ? (
              <Card
                sx={{
                  p: { xs: 2.5, sm: 3.5 },
                  border: '1px solid rgba(16, 231, 96, 0.25)',
                  boxShadow: '0 12px 40px rgba(0, 0, 0, 0.4), 0 0 24px rgba(16, 231, 96, 0.1)',
                }}
              >
                {/* AI Header */}
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 3 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                    <Box
                      sx={{
                        width: 44,
                        height: 44,
                        borderRadius: '12px',
                        bgcolor: 'rgba(16, 231, 96, 0.15)',
                        color: '#10E760',
                        border: '1px solid rgba(16, 231, 96, 0.3)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        boxShadow: '0 0 20px rgba(16, 231, 96, 0.3)',
                      }}
                    >
                      <AutoAwesomeRoundedIcon sx={{ fontSize: 24 }} />
                    </Box>
                    <Box>
                      <Typography variant="h5" sx={{ fontWeight: 800, color: '#F8FAFC' }}>
                        AI Performance Analysis
                      </Typography>
                      <Typography variant="caption" sx={{ color: '#94A3B8' }}>
                        Powered by Google Gemini Fitness Intelligence
                      </Typography>
                    </Box>
                  </Box>

                  <Chip
                    label="Gemini AI"
                    sx={{
                      bgcolor: 'rgba(16, 231, 96, 0.1)',
                      color: '#10E760',
                      fontWeight: 700,
                      border: '1px solid rgba(16, 231, 96, 0.25)',
                    }}
                  />
                </Box>

                {/* Main Analysis Narrative */}
                {recommendation.recommendation && (
                  <Box
                    sx={{
                      p: 2.5,
                      borderRadius: '14px',
                      bgcolor: 'rgba(11, 18, 32, 0.8)',
                      border: '1px solid rgba(255, 255, 255, 0.06)',
                      mb: 3,
                    }}
                  >
                    <Typography variant="subtitle2" sx={{ fontWeight: 700, color: '#10E760', mb: 1 }}>
                      Coach's Summary
                    </Typography>
                    <Typography variant="body1" sx={{ color: '#E2E8F0', lineHeight: 1.7 }}>
                      {recommendation.recommendation}
                    </Typography>
                  </Box>
                )}

                {/* Structured Insights: Improvements, Suggestions, Safety */}
                <Grid2 container spacing={2.5}>
                  {/* Key Improvements */}
                  {Array.isArray(recommendation.improvements) && recommendation.improvements.length > 0 && (
                    <Grid2 size={{ xs: 12 }}>
                      <Box
                        sx={{
                          p: 2.5,
                          borderRadius: '14px',
                          bgcolor: 'rgba(16, 231, 96, 0.05)',
                          border: '1px solid rgba(16, 231, 96, 0.2)',
                        }}
                      >
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1.5 }}>
                          <CheckCircleRoundedIcon sx={{ color: '#10E760', fontSize: 20 }} />
                          <Typography variant="subtitle1" sx={{ fontWeight: 700, color: '#F8FAFC' }}>
                            Areas of Improvement
                          </Typography>
                        </Box>
                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                          {recommendation.improvements.map((item, idx) => (
                            <Box key={idx} sx={{ display: 'flex', alignItems: 'flex-start', gap: 1 }}>
                              <Typography sx={{ color: '#10E760', fontWeight: 700, lineHeight: 1.5 }}>
                                •
                              </Typography>
                              <Typography variant="body2" sx={{ color: '#CBD5E1', lineHeight: 1.6 }}>
                                {item}
                              </Typography>
                            </Box>
                          ))}
                        </Box>
                      </Box>
                    </Grid2>
                  )}

                  {/* Suggestions */}
                  {Array.isArray(recommendation.suggestions) && recommendation.suggestions.length > 0 && (
                    <Grid2 size={{ xs: 12, md: 6 }}>
                      <Box
                        sx={{
                          p: 2.5,
                          borderRadius: '14px',
                          bgcolor: 'rgba(56, 189, 248, 0.05)',
                          border: '1px solid rgba(56, 189, 248, 0.2)',
                          height: '100%',
                        }}
                      >
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1.5 }}>
                          <LightbulbRoundedIcon sx={{ color: '#38BDF8', fontSize: 20 }} />
                          <Typography variant="subtitle1" sx={{ fontWeight: 700, color: '#F8FAFC' }}>
                            Actionable Suggestions
                          </Typography>
                        </Box>
                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                          {recommendation.suggestions.map((item, idx) => (
                            <Box key={idx} sx={{ display: 'flex', alignItems: 'flex-start', gap: 1 }}>
                              <Typography sx={{ color: '#38BDF8', fontWeight: 700, lineHeight: 1.5 }}>
                                •
                              </Typography>
                              <Typography variant="body2" sx={{ color: '#CBD5E1', lineHeight: 1.6 }}>
                                {item}
                              </Typography>
                            </Box>
                          ))}
                        </Box>
                      </Box>
                    </Grid2>
                  )}

                  {/* Safety Guidelines */}
                  {Array.isArray(recommendation.safety) && recommendation.safety.length > 0 && (
                    <Grid2 size={{ xs: 12, md: 6 }}>
                      <Box
                        sx={{
                          p: 2.5,
                          borderRadius: '14px',
                          bgcolor: 'rgba(245, 158, 11, 0.05)',
                          border: '1px solid rgba(245, 158, 11, 0.2)',
                          height: '100%',
                        }}
                      >
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1.5 }}>
                          <ShieldRoundedIcon sx={{ color: '#F59E0B', fontSize: 20 }} />
                          <Typography variant="subtitle1" sx={{ fontWeight: 700, color: '#F8FAFC' }}>
                            Safety & Recovery Guidelines
                          </Typography>
                        </Box>
                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                          {recommendation.safety.map((item, idx) => (
                            <Box key={idx} sx={{ display: 'flex', alignItems: 'flex-start', gap: 1 }}>
                              <Typography sx={{ color: '#F59E0B', fontWeight: 700, lineHeight: 1.5 }}>
                                •
                              </Typography>
                              <Typography variant="body2" sx={{ color: '#CBD5E1', lineHeight: 1.6 }}>
                                {item}
                              </Typography>
                            </Box>
                          ))}
                        </Box>
                      </Box>
                    </Grid2>
                  )}
                </Grid2>
              </Card>
            ) : (
              /* Fallback when AI analysis is still processing */
              <Card
                sx={{
                  p: 4,
                  textAlign: 'center',
                  bgcolor: 'rgba(15, 23, 42, 0.6)',
                  border: '1px dashed rgba(255, 255, 255, 0.12)',
                }}
              >
                <HourglassEmptyRoundedIcon sx={{ fontSize: 44, color: '#10E760', mb: 1.5 }} />
                <Typography variant="h6" sx={{ fontWeight: 700, color: '#F8FAFC', mb: 0.5 }}>
                  AI Analysis Pending
                </Typography>
                <Typography variant="body2" sx={{ color: '#94A3B8', maxWidth: 480, mx: 'auto' }}>
                  Our AI engine analyzes your session asynchronously. If you just logged this workout, check back in a few seconds to see your tailored coaching recommendations.
                </Typography>
              </Card>
            )}
          </Box>
        ) : null}
      </Box>
    </Box>
  );
};

export default ActivityDetail;
