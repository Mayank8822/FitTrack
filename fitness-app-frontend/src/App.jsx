import React, { useContext, useEffect, useState, useCallback, useRef } from 'react';
import {
  Box,
  Button,
  Typography,
  Container,
  Grid2,
  Card,
  CardContent,
  Snackbar,
  Alert,
  Chip,
} from '@mui/material';
import { AuthContext } from 'react-oauth2-code-pkce';
import { useDispatch } from 'react-redux';
import { BrowserRouter as Router, Navigate, Route, Routes } from 'react-router';
import { setCredentials } from './store/authSlice';
import { getActivities, deleteActivity } from './services/api';

import ActivitiesPageHeader from './components/ActivitiesPageHeader';
import DashboardMetrics from './components/DashboardMetrics';
import WeeklyAnalytics from './components/WeeklyAnalytics';
import ActivityList from './components/ActivityList';
import ActivityModal from './components/ActivityModal';
import ActivityDetail from './components/ActivityDetail';
import CommunityPage from './components/CommunityPage';
import FitnessProfilePage from './components/FitnessProfilePage';
import MlCoachPage from './components/MlCoachPage';

import DirectionsRunRoundedIcon from '@mui/icons-material/DirectionsRunRounded';
import AutoAwesomeRoundedIcon from '@mui/icons-material/AutoAwesomeRounded';
import InsightsRoundedIcon from '@mui/icons-material/InsightsRounded';
import BoltRoundedIcon from '@mui/icons-material/BoltRounded';
import LockOpenRoundedIcon from '@mui/icons-material/LockOpenRounded';
import ArrowForwardRoundedIcon from '@mui/icons-material/ArrowForwardRounded';

const ActivitiesPage = () => {
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState(null);
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [toast, setToast] = useState({ open: false, message: '', severity: 'success' });

  const analyticsRef = useRef(null);
  const activitiesRef = useRef(null);
  const dashboardRef = useRef(null);

  const fetchActivities = useCallback(async () => {
    try {
      setLoading(true);
      const res = await getActivities();
      setActivities(res.data || []);
    } catch (err) {
      console.error('Failed to fetch activities:', err);
      setToast({
        open: true,
        message: 'Failed to load workouts. Please check your connection.',
        severity: 'error',
      });
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchActivities();
  }, [fetchActivities]);

  const handleDeleteActivity = async (id) => {
    const previous = activities;
    setDeletingId(id);
    // Optimistic removal
    setActivities((prev) => prev.filter((a) => a.id !== id));

    try {
      await deleteActivity(id);
      setToast({ open: true, message: 'Workout deleted successfully', severity: 'success' });
    } catch (err) {
      console.error('Failed to delete activity:', err);
      setActivities(previous);
      setToast({ open: true, message: 'Failed to delete workout. Please try again.', severity: 'error' });
    } finally {
      setDeletingId(null);
    }
  };

  const handleActivityAdded = () => {
    fetchActivities();
    setToast({ open: true, message: 'Workout logged successfully! AI analysis initiated.', severity: 'success' });
  };

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    if (tab === 'dashboard' && dashboardRef.current) {
      dashboardRef.current.scrollIntoView({ behavior: 'smooth' });
    } else if (tab === 'analytics' && analyticsRef.current) {
      analyticsRef.current.scrollIntoView({ behavior: 'smooth' });
    } else if (tab === 'activities' && activitiesRef.current) {
      activitiesRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: '#070B14', color: '#F8FAFC', pb: 10 }}>
      {/* Professional Sticky Header */}
      <ActivitiesPageHeader
        onOpenAddModal={() => setAddModalOpen(true)}
        activeTab={activeTab}
        onTabChange={handleTabChange}
      />

      {activeTab === 'community' ? <CommunityPage /> : activeTab === 'mlcoach' ? <MlCoachPage /> : activeTab === 'profile' ? <FitnessProfilePage /> : <>
      {/* Main Content Dashboard Container */}
      <Container maxWidth="xl" sx={{ px: { xs: 2, sm: 3, md: 4 }, pt: 3 }} ref={dashboardRef}>
        {/* Welcome greeting banner */}
        <Box sx={{ mb: 3 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
            <Typography variant="h4" sx={{ fontWeight: 800, color: '#F8FAFC' }}>
              Athlete Dashboard
            </Typography>
            <Chip
              label="Live Sync"
              size="small"
              sx={{
                bgcolor: 'rgba(16, 231, 96, 0.1)',
                color: '#10E760',
                border: '1px solid rgba(16, 231, 96, 0.3)',
                fontWeight: 700,
                fontSize: '0.7rem',
              }}
            />
          </Box>
          <Typography variant="body2" sx={{ color: '#94A3B8' }}>
            Monitor real-time fitness metrics, weekly volume, and personalized AI coaching insights.
          </Typography>
        </Box>

        {/* 1. Dashboard Summary Cards */}
        <DashboardMetrics activities={activities} />

        {/* 2. Weekly Workout Analytics Section */}
        <Box ref={analyticsRef}>
          <WeeklyAnalytics activities={activities} />
        </Box>

        {/* 3. Workouts Section */}
        <Box ref={activitiesRef} sx={{ pt: 1 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
            <Box>
              <Typography variant="h5" sx={{ fontWeight: 800, color: '#F8FAFC' }}>
                Recent Workouts
              </Typography>
              <Typography variant="caption" sx={{ color: '#94A3B8' }}>
                {activities.length} total recorded sessions
              </Typography>
            </Box>
          </Box>

          <ActivityList
            activities={activities}
            loading={loading}
            onDeleteActivity={handleDeleteActivity}
            onOpenAddModal={() => setAddModalOpen(true)}
            deletingId={deletingId}
          />
        </Box>
      </Container>
      </>}

      {/* Add Activity Modal / Drawer */}
      <ActivityModal
        open={addModalOpen}
        onClose={() => setAddModalOpen(false)}
        onActivityAdded={handleActivityAdded}
      />

      {/* Toast Notification */}
      <Snackbar
        open={toast.open}
        autoHideDuration={3500}
        onClose={() => setToast((prev) => ({ ...prev, open: false }))}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert
          severity={toast.severity}
          variant="filled"
          onClose={() => setToast((prev) => ({ ...prev, open: false }))}
          sx={{
            borderRadius: '12px',
            boxShadow: '0 8px 30px rgba(0, 0, 0, 0.5)',
            fontWeight: 600,
          }}
        >
          {toast.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

/* Unauthenticated Landing / Login Screen */
const LoginScreen = ({ onLogin }) => {
  return (
    <Box
      sx={{
        minHeight: '100vh',
        bgcolor: '#070B14',
        backgroundImage: `
          radial-gradient(circle at 50% 15%, rgba(16, 231, 96, 0.12) 0%, transparent 50%),
          radial-gradient(circle at 85% 85%, rgba(56, 189, 248, 0.08) 0%, transparent 40%)
        `,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        px: 3,
        py: 6,
      }}
    >
      <Container maxWidth="md">
        <Box sx={{ textAlign: 'center', mb: 5 }}>
          {/* Logo Badge */}
          <Box
            sx={{
              width: 64,
              height: 64,
              borderRadius: '20px',
              background: 'linear-gradient(135deg, #10E760 0%, #00B843 100%)',
              color: '#06170B',
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              mb: 3,
              boxShadow: '0 0 35px rgba(16, 231, 96, 0.45)',
            }}
          >
            <DirectionsRunRoundedIcon sx={{ fontSize: 40 }} />
          </Box>

          {/* Heading */}
          <Typography
            variant="h2"
            sx={{
              fontWeight: 800,
              color: '#F8FAFC',
              letterSpacing: '-0.03em',
              fontSize: { xs: '2.2rem', sm: '3.2rem' },
              lineHeight: 1.15,
              mb: 2,
            }}
          >
            Elevate Your Fitness With{' '}
            <span style={{ color: '#10E760' }}>AI Intelligence</span>
          </Typography>

          <Typography
            variant="h6"
            sx={{
              color: '#94A3B8',
              fontWeight: 400,
              maxWidth: 620,
              mx: 'auto',
              mb: 4,
              fontSize: { xs: '1rem', sm: '1.15rem' },
              lineHeight: 1.6,
            }}
          >
            Track workouts, visualize weekly analytics, and receive customized coaching recommendations powered by Google Gemini AI.
          </Typography>

          {/* Login Action Button */}
          <Button
            variant="contained"
            color="primary"
            size="large"
            startIcon={<LockOpenRoundedIcon />}
            endIcon={<ArrowForwardRoundedIcon />}
            onClick={() => onLogin()}
            sx={{
              px: 4,
              py: 1.6,
              fontSize: '1.05rem',
              fontWeight: 800,
              borderRadius: '14px',
              boxShadow: '0 0 30px rgba(16, 231, 96, 0.4)',
              transition: 'all 0.25s ease',
              '&:hover': {
                transform: 'translateY(-2px)',
                boxShadow: '0 0 45px rgba(16, 231, 96, 0.6)',
              },
            }}
          >
            Sign In with Keycloak
          </Button>
        </Box>

        {/* Feature Cards Grid */}
        <Grid2 container spacing={2.5} sx={{ mt: 2 }}>
          <Grid2 size={{ xs: 12, md: 4 }}>
            <Card
              sx={{
                p: 3,
                bgcolor: 'rgba(15, 23, 42, 0.7)',
                border: '1px solid rgba(255, 255, 255, 0.08)',
                backdropFilter: 'blur(16px)',
                height: '100%',
              }}
            >
              <Box
                sx={{
                  width: 42,
                  height: 42,
                  borderRadius: '12px',
                  bgcolor: 'rgba(16, 231, 96, 0.15)',
                  color: '#10E760',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  mb: 2,
                }}
              >
                <BoltRoundedIcon />
              </Box>
              <Typography variant="subtitle1" sx={{ fontWeight: 700, color: '#F8FAFC', mb: 0.5 }}>
                Multi-Sport Tracking
              </Typography>
              <Typography variant="body2" sx={{ color: '#94A3B8' }}>
                Tailored logging for Running, Cycling, Swimming, HIIT, Stretching, and Strength Training.
              </Typography>
            </Card>
          </Grid2>

          <Grid2 size={{ xs: 12, md: 4 }}>
            <Card
              sx={{
                p: 3,
                bgcolor: 'rgba(15, 23, 42, 0.7)',
                border: '1px solid rgba(255, 255, 255, 0.08)',
                backdropFilter: 'blur(16px)',
                height: '100%',
              }}
            >
              <Box
                sx={{
                  width: 42,
                  height: 42,
                  borderRadius: '12px',
                  bgcolor: 'rgba(56, 189, 248, 0.15)',
                  color: '#38BDF8',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  mb: 2,
                }}
              >
                <InsightsRoundedIcon />
              </Box>
              <Typography variant="subtitle1" sx={{ fontWeight: 700, color: '#F8FAFC', mb: 0.5 }}>
                Weekly Volume Charts
              </Typography>
              <Typography variant="body2" sx={{ color: '#94A3B8' }}>
                Track daily calories burned, workout duration, and progress towards WHO aerobic goals.
              </Typography>
            </Card>
          </Grid2>

          <Grid2 size={{ xs: 12, md: 4 }}>
            <Card
              sx={{
                p: 3,
                bgcolor: 'rgba(15, 23, 42, 0.7)',
                border: '1px solid rgba(255, 255, 255, 0.08)',
                backdropFilter: 'blur(16px)',
                height: '100%',
              }}
            >
              <Box
                sx={{
                  width: 42,
                  height: 42,
                  borderRadius: '12px',
                  bgcolor: 'rgba(168, 85, 247, 0.15)',
                  color: '#A855F7',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  mb: 2,
                }}
              >
                <AutoAwesomeRoundedIcon />
              </Box>
              <Typography variant="subtitle1" sx={{ fontWeight: 700, color: '#F8FAFC', mb: 0.5 }}>
                AI Recommendations
              </Typography>
              <Typography variant="body2" sx={{ color: '#94A3B8' }}>
                Instant AI breakdown of performance improvements, safety precautions, and next steps.
              </Typography>
            </Card>
          </Grid2>
        </Grid2>
      </Container>
    </Box>
  );
};

function App() {
  const { token, tokenData, logIn } = useContext(AuthContext);
  const dispatch = useDispatch();

  useEffect(() => {
    if (token) {
      localStorage.setItem('token', token);
      const sub = tokenData?.sub || (token.includes('.') ? JSON.parse(atob(token.split('.')[1])).sub : null);
      if (sub) {
        localStorage.setItem('userId', sub);
      }
      dispatch(setCredentials({ token, user: tokenData }));
    }
  }, [token, tokenData, dispatch]);

  return (
    <Router>
      {!token ? (
        <LoginScreen onLogin={() => logIn()} />
      ) : (
        <Routes>
          <Route path="/activities" element={<ActivitiesPage />} />
          <Route path="/activities/:id" element={<ActivityDetail />} />
          <Route path="/" element={<Navigate to="/activities" replace />} />
          <Route path="*" element={<Navigate to="/activities" replace />} />
        </Routes>
      )}
    </Router>
  );
}

export default App;
