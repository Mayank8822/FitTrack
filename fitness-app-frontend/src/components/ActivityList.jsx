import React, { useState, useMemo } from 'react';
import {
  Grid2,
  Box,
  Typography,
  Skeleton,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Snackbar,
  Alert,
} from '@mui/material';
import AddRoundedIcon from '@mui/icons-material/AddRounded';
import DirectionsRunRoundedIcon from '@mui/icons-material/DirectionsRunRounded';
import SearchOffRoundedIcon from '@mui/icons-material/SearchOffRounded';
import WarningAmberRoundedIcon from '@mui/icons-material/WarningAmberRounded';
import { useNavigate } from 'react-router';
import ActivityCard from './ActivityCard';
import ActivityFilters from './ActivityFilters';

const ActivityList = ({
  activities = [],
  loading = false,
  onDeleteActivity,
  onOpenAddModal,
  deletingId,
}) => {
  const navigate = useNavigate();

  // Search & Filter State
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState('ALL');
  const [sortBy, setSortBy] = useState('newest');
  const [viewMode, setViewMode] = useState('grid'); // 'grid' | 'list'

  // Confirm Delete Dialog State
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [targetDeleteId, setTargetDeleteId] = useState(null);

  const handleOpenDeleteConfirm = (id) => {
    setTargetDeleteId(id);
    setDeleteConfirmOpen(true);
  };

  const handleCloseDeleteConfirm = () => {
    setTargetDeleteId(null);
    setDeleteConfirmOpen(false);
  };

  const handleConfirmDelete = async () => {
    if (targetDeleteId && onDeleteActivity) {
      await onDeleteActivity(targetDeleteId);
    }
    handleCloseDeleteConfirm();
  };

  const handleViewRecommendation = (activityId) => {
    navigate(`/activities/${activityId}`);
  };

  // Filter and Sort activities
  const filteredActivities = useMemo(() => {
    let result = [...activities];

    // Filter by category
    if (selectedType !== 'ALL') {
      result = result.filter(
        (a) => (a.type || '').toUpperCase() === selectedType.toUpperCase()
      );
    }

    // Filter by search query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      result = result.filter((a) => {
        const typeMatch = (a.type || '').toLowerCase().includes(q);
        const durationMatch = String(a.duration || '').includes(q);
        const caloriesMatch = String(a.caloriesBurned || '').includes(q);
        return typeMatch || durationMatch || caloriesMatch;
      });
    }

    // Sort
    result.sort((a, b) => {
      const dateA = new Date(a.createdAt || a.startTime || 0).getTime();
      const dateB = new Date(b.createdAt || b.startTime || 0).getTime();

      switch (sortBy) {
        case 'oldest':
          return dateA - dateB;
        case 'calories_desc':
          return (Number(b.caloriesBurned) || 0) - (Number(a.caloriesBurned) || 0);
        case 'duration_desc':
          return (Number(b.duration) || 0) - (Number(a.duration) || 0);
        case 'newest':
        default:
          return dateB - dateA;
      }
    });

    return result;
  }, [activities, selectedType, searchQuery, sortBy]);

  return (
    <Box sx={{ mt: 2 }}>
      {/* Controls: Search, Category Filters, Sort, View Toggle */}
      <ActivityFilters
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        selectedType={selectedType}
        onTypeChange={setSelectedType}
        sortBy={sortBy}
        onSortChange={setSortBy}
        viewMode={viewMode}
        onViewModeChange={setViewMode}
        activities={activities}
      />

      {/* Loading Skeletons */}
      {loading && (
        <Grid2 container spacing={2.5}>
          {[1, 2, 3, 4, 5, 6].map((item) => (
            <Grid2 key={item} size={{ xs: 12, sm: 6, md: 4 }}>
              <Box
                sx={{
                  p: 2.5,
                  borderRadius: '18px',
                  bgcolor: '#0F172A',
                  border: '1px solid rgba(255, 255, 255, 0.05)',
                }}
              >
                <Box sx={{ display: 'flex', gap: 2, alignItems: 'center', mb: 2 }}>
                  <Skeleton variant="rounded" width={46} height={46} sx={{ bgcolor: 'rgba(255, 255, 255, 0.08)' }} />
                  <Box sx={{ flexGrow: 1 }}>
                    <Skeleton width="60%" height={24} sx={{ bgcolor: 'rgba(255, 255, 255, 0.08)' }} />
                    <Skeleton width="40%" height={16} sx={{ bgcolor: 'rgba(255, 255, 255, 0.05)' }} />
                  </Box>
                </Box>
                <Skeleton variant="rounded" height={60} sx={{ mb: 2, bgcolor: 'rgba(255, 255, 255, 0.05)' }} />
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Skeleton width={80} height={24} sx={{ bgcolor: 'rgba(255, 255, 255, 0.05)' }} />
                  <Skeleton width={90} height={32} sx={{ bgcolor: 'rgba(255, 255, 255, 0.08)' }} />
                </Box>
              </Box>
            </Grid2>
          ))}
        </Grid2>
      )}

      {/* Empty State: No activities yet in system */}
      {!loading && activities.length === 0 && (
        <Box
          sx={{
            py: 8,
            px: 3,
            textAlign: 'center',
            bgcolor: 'rgba(15, 23, 42, 0.6)',
            borderRadius: '20px',
            border: '1px dashed rgba(255, 255, 255, 0.12)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Box
            sx={{
              width: 72,
              height: 72,
              borderRadius: '20px',
              bgcolor: 'rgba(16, 231, 96, 0.1)',
              color: '#10E760',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              mb: 2,
              boxShadow: '0 0 24px rgba(16, 231, 96, 0.2)',
            }}
          >
            <DirectionsRunRoundedIcon sx={{ fontSize: 38 }} />
          </Box>
          <Typography variant="h5" sx={{ fontWeight: 700, color: '#F8FAFC', mb: 1 }}>
            No Workouts Logged Yet
          </Typography>
          <Typography variant="body2" sx={{ color: '#94A3B8', maxWidth: 440, mb: 3 }}>
            Begin tracking your athletic progress and receive AI-tailored performance feedback.
          </Typography>
          <Button
            variant="contained"
            color="primary"
            startIcon={<AddRoundedIcon />}
            onClick={onOpenAddModal}
            sx={{
              px: 3,
              py: 1.2,
              fontWeight: 700,
              boxShadow: '0 0 20px rgba(16, 231, 96, 0.35)',
            }}
          >
            Log Your First Workout
          </Button>
        </Box>
      )}

      {/* Empty State: Filter/Search matched nothing */}
      {!loading && activities.length > 0 && filteredActivities.length === 0 && (
        <Box
          sx={{
            py: 6,
            px: 3,
            textAlign: 'center',
            bgcolor: 'rgba(15, 23, 42, 0.4)',
            borderRadius: '18px',
            border: '1px solid rgba(255, 255, 255, 0.06)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <SearchOffRoundedIcon sx={{ fontSize: 48, color: '#64748B', mb: 1.5 }} />
          <Typography variant="h6" sx={{ fontWeight: 700, color: '#F8FAFC', mb: 0.5 }}>
            No Matching Workouts
          </Typography>
          <Typography variant="body2" sx={{ color: '#94A3B8', mb: 2 }}>
            No activities match your current search criteria or category filter.
          </Typography>
          <Button
            variant="outlined"
            size="small"
            onClick={() => {
              setSearchQuery('');
              setSelectedType('ALL');
            }}
            sx={{
              color: '#10E760',
              borderColor: 'rgba(16, 231, 96, 0.3)',
              '&:hover': { borderColor: '#10E760', bgcolor: 'rgba(16, 231, 96, 0.08)' },
            }}
          >
            Reset Filters
          </Button>
        </Box>
      )}

      {/* Activities Grid or List */}
      {!loading && filteredActivities.length > 0 && (
        <Grid2 container spacing={2.5}>
          {filteredActivities.map((activity) => (
            <Grid2
              key={activity.id}
              size={
                viewMode === 'list'
                  ? { xs: 12 }
                  : { xs: 12, sm: 6, md: 4 }
              }
            >
              <ActivityCard
                activity={activity}
                onDelete={handleOpenDeleteConfirm}
                onViewRecommendation={handleViewRecommendation}
                isDeleting={deletingId === activity.id}
              />
            </Grid2>
          ))}
        </Grid2>
      )}

      {/* Custom Confirmation Dialog for Deletion */}
      <Dialog
        open={deleteConfirmOpen}
        onClose={handleCloseDeleteConfirm}
        aria-labelledby="confirm-delete-title"
        aria-describedby="confirm-delete-description"
        slotProps={{
          backdrop: { sx: { backdropFilter: 'blur(6px)', bgcolor: 'rgba(0, 0, 0, 0.7)' } },
        }}
      >
        <Box sx={{ p: 2.5 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 1.5 }}>
            <Box
              sx={{
                width: 40,
                height: 40,
                borderRadius: '10px',
                bgcolor: 'rgba(239, 68, 68, 0.15)',
                color: '#EF4444',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <WarningAmberRoundedIcon />
            </Box>
            <DialogTitle id="confirm-delete-title" sx={{ p: 0, fontWeight: 700, color: '#F8FAFC' }}>
              Delete Workout
            </DialogTitle>
          </Box>

          <DialogContent sx={{ p: 0, mb: 3 }}>
            <DialogContentText id="confirm-delete-description" sx={{ color: '#94A3B8', fontSize: '0.9rem' }}>
              Are you sure you want to delete this workout? This action cannot be undone and will remove associated data.
            </DialogContentText>
          </DialogContent>

          <DialogActions sx={{ p: 0, gap: 1 }}>
            <Button
              onClick={handleCloseDeleteConfirm}
              variant="outlined"
              sx={{
                color: '#94A3B8',
                borderColor: 'rgba(255, 255, 255, 0.15)',
                '&:hover': { borderColor: '#F8FAFC', bgcolor: 'rgba(255, 255, 255, 0.05)' },
              }}
            >
              Cancel
            </Button>
            <Button
              onClick={handleConfirmDelete}
              variant="contained"
              sx={{
                bgcolor: '#EF4444',
                color: '#FFFFFF',
                '&:hover': { bgcolor: '#DC2626', boxShadow: '0 0 16px rgba(239, 68, 68, 0.4)' },
              }}
            >
              Delete
            </Button>
          </DialogActions>
        </Box>
      </Dialog>
    </Box>
  );
};

export default ActivityList;
