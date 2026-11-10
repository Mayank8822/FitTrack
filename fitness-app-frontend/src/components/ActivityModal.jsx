import React, { useState } from 'react';
import {
  Dialog,
  Button,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Box,
  Typography,
  IconButton,
  Chip,
  Alert,
  CircularProgress,
  InputAdornment,
} from '@mui/material';
import CloseRoundedIcon from '@mui/icons-material/CloseRounded';
import AddRoundedIcon from '@mui/icons-material/AddRounded';
import AutoAwesomeRoundedIcon from '@mui/icons-material/AutoAwesomeRounded';
import LocalFireDepartmentRoundedIcon from '@mui/icons-material/LocalFireDepartmentRounded';
import TimerRoundedIcon from '@mui/icons-material/TimerRounded';
import SportsRoundedIcon from '@mui/icons-material/SportsRounded';
import { addActivity } from '../services/api';
import {
  ACTIVITY_CONFIGS,
  estimateCalories,
  normalizeActivityTypeForBackend,
} from '../utils/activityUtils';

const ActivityModal = ({ open, onClose, onActivityAdded }) => {
  const [formData, setFormData] = useState({
    type: 'RUNNING',
    customSportName: '',
    duration: '',
    caloriesBurned: '',
    additionalMetrics: {},
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (error) setError('');
  };

  const handleQuickDuration = (minutes) => {
    const newDuration = String(minutes);
    const estimated = estimateCalories(formData.type, minutes);
    setFormData((prev) => ({
      ...prev,
      duration: newDuration,
      caloriesBurned: prev.caloriesBurned ? prev.caloriesBurned : String(estimated),
    }));
  };

  const handleAutoEstimateCalories = () => {
    if (!formData.duration) {
      setError('Please enter a duration first to estimate calories');
      return;
    }
    const estimated = estimateCalories(formData.type, formData.duration);
    setFormData((prev) => ({ ...prev, caloriesBurned: String(estimated) }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.duration || Number(formData.duration) <= 0) {
      setError('Please enter a valid workout duration (greater than 0 mins)');
      return;
    }

    setLoading(true);
    setError('');

    try {
      // Normalize type to ensure it matches the backend ActivityType enum
      const backendType = normalizeActivityTypeForBackend(formData.type);

      const metrics = { ...formData.additionalMetrics };
      if (formData.customSportName.trim()) {
        metrics.customSportName = formData.customSportName.trim();
      }

      const payload = {
        type: backendType,
        duration: Number(formData.duration),
        caloriesBurned: formData.caloriesBurned
          ? Number(formData.caloriesBurned)
          : estimateCalories(formData.type, formData.duration),
        additionalMetrics: metrics,
      };

      await addActivity(payload);
      onActivityAdded();
      handleClose();
    } catch (err) {
      console.error('Failed to log activity:', err);
      const serverMsg =
        err.response?.data?.message ||
        err.response?.data?.error ||
        err.message;
      const status = err.response?.status;

      if (status === 401) {
        setError('Session expired or unauthorized. Please re-login.');
      } else if (serverMsg && typeof serverMsg === 'string') {
        setError(`Failed to record activity: ${serverMsg}`);
      } else {
        setError('Failed to record activity. Please check your backend connection.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setFormData({
      type: 'RUNNING',
      customSportName: '',
      duration: '',
      caloriesBurned: '',
      additionalMetrics: {},
    });
    setError('');
    onClose();
  };

  const currentConfig = ACTIVITY_CONFIGS[formData.type] || ACTIVITY_CONFIGS.OTHER;
  const CurrentIcon = currentConfig.icon;

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth="sm"
      fullWidth
      slotProps={{
        backdrop: {
          sx: { backdropFilter: 'blur(8px)', backgroundColor: 'rgba(5, 8, 15, 0.75)' },
        },
      }}
    >
      <Box
        component="form"
        onSubmit={handleSubmit}
        sx={{
          p: { xs: 2.5, sm: 3.5 },
        }}
      >
        {/* Title Header */}
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 3 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
            <Box
              sx={{
                width: 44,
                height: 44,
                borderRadius: '12px',
                bgcolor: currentConfig.bgGlow,
                color: currentConfig.color,
                border: `1px solid ${currentConfig.borderGlow}`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <CurrentIcon sx={{ fontSize: 26 }} />
            </Box>
            <Box>
              <Typography variant="h6" sx={{ fontWeight: 800, color: '#F8FAFC' }}>
                Log Workout
              </Typography>
              <Typography variant="caption" sx={{ color: '#94A3B8' }}>
                Record your session to generate AI performance insights
              </Typography>
            </Box>
          </Box>

          <IconButton
            onClick={handleClose}
            aria-label="close modal"
            sx={{
              color: '#94A3B8',
              '&:hover': { color: '#F8FAFC', bgcolor: 'rgba(255, 255, 255, 0.08)' },
            }}
          >
            <CloseRoundedIcon />
          </IconButton>
        </Box>

        {error && (
          <Alert severity="error" sx={{ mb: 3, borderRadius: '12px' }}>
            {error}
          </Alert>
        )}

        {/* Activity Type Selection */}
        <FormControl fullWidth sx={{ mb: 2.5 }}>
          <InputLabel id="activity-type-label" sx={{ color: '#94A3B8' }}>
            Activity Type
          </InputLabel>
          <Select
            labelId="activity-type-label"
            label="Activity Type"
            value={formData.type}
            onChange={(e) => handleChange('type', e.target.value)}
            sx={{
              '& .MuiSelect-select': {
                display: 'flex',
                alignItems: 'center',
                gap: 1.5,
              },
            }}
          >
            {Object.entries(ACTIVITY_CONFIGS).map(([key, config]) => {
              const Icon = config.icon;
              return (
                <MenuItem
                  key={key}
                  value={key}
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1.5,
                    py: 1.2,
                  }}
                >
                  <Box
                    sx={{
                      width: 28,
                      height: 28,
                      borderRadius: '8px',
                      bgcolor: config.bgGlow,
                      color: config.color,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <Icon sx={{ fontSize: 18 }} />
                  </Box>
                  <Typography variant="body2" sx={{ fontWeight: 600 }}>
                    {config.label}
                  </Typography>
                </MenuItem>
              );
            })}
          </Select>
        </FormControl>

        {/* If 'OTHER' is selected, show optional sport name */}
        {formData.type === 'OTHER' && (
          <Box sx={{ mb: 2.5 }}>
            <TextField
              fullWidth
              label="Sport / Activity Name (Optional)"
              placeholder="e.g. Badminton, Tennis, Dancing"
              value={formData.customSportName}
              onChange={(e) => handleChange('customSportName', e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SportsRoundedIcon sx={{ color: '#94A3B8', fontSize: 20 }} />
                  </InputAdornment>
                ),
              }}
            />
          </Box>
        )}

        {/* Duration Field */}
        <Box sx={{ mb: 3 }}>
          <TextField
            fullWidth
            label="Duration"
            type="number"
            placeholder="e.g. 45"
            value={formData.duration}
            onChange={(e) => handleChange('duration', e.target.value)}
            required
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <TimerRoundedIcon sx={{ color: '#38BDF8', fontSize: 20 }} />
                </InputAdornment>
              ),
              endAdornment: <InputAdornment position="end">minutes</InputAdornment>,
            }}
          />

          {/* Quick-select duration chips */}
          <Box sx={{ display: 'flex', gap: 1, mt: 1.5, flexWrap: 'wrap' }}>
            {[15, 30, 45, 60, 90].map((mins) => (
              <Chip
                key={mins}
                label={`+${mins} min`}
                size="small"
                onClick={() => handleQuickDuration(mins)}
                sx={{
                  bgcolor:
                    Number(formData.duration) === mins
                      ? 'rgba(16, 231, 96, 0.2)'
                      : 'rgba(255, 255, 255, 0.05)',
                  color: Number(formData.duration) === mins ? '#10E760' : '#94A3B8',
                  border:
                    Number(formData.duration) === mins
                      ? '1px solid rgba(16, 231, 96, 0.4)'
                      : '1px solid rgba(255, 255, 255, 0.08)',
                  cursor: 'pointer',
                  '&:hover': {
                    bgcolor: 'rgba(16, 231, 96, 0.1)',
                    color: '#10E760',
                  },
                }}
              />
            ))}
          </Box>
        </Box>

        {/* Calories Burned Field */}
        <Box sx={{ mb: 4 }}>
          <TextField
            fullWidth
            label="Calories Burned"
            type="number"
            placeholder="e.g. 350"
            value={formData.caloriesBurned}
            onChange={(e) => handleChange('caloriesBurned', e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <LocalFireDepartmentRoundedIcon sx={{ color: '#FB923C', fontSize: 20 }} />
                </InputAdornment>
              ),
              endAdornment: <InputAdornment position="end">kcal</InputAdornment>,
            }}
          />

          <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 1 }}>
            <Button
              size="small"
              startIcon={<AutoAwesomeRoundedIcon sx={{ fontSize: 16 }} />}
              onClick={handleAutoEstimateCalories}
              sx={{
                color: '#10E760',
                fontSize: '0.75rem',
                p: 0.5,
                '&:hover': { bgcolor: 'rgba(16, 231, 96, 0.1)' },
              }}
            >
              Auto-estimate from duration
            </Button>
          </Box>
        </Box>

        {/* Action Buttons */}
        <Box sx={{ display: 'flex', gap: 1.5, justifyContent: 'flex-end' }}>
          <Button
            variant="outlined"
            onClick={handleClose}
            disabled={loading}
            sx={{
              color: '#94A3B8',
              borderColor: 'rgba(255, 255, 255, 0.15)',
              '&:hover': { borderColor: '#F8FAFC', bgcolor: 'rgba(255, 255, 255, 0.05)' },
            }}
          >
            Cancel
          </Button>

          <Button
            type="submit"
            variant="contained"
            color="primary"
            disabled={loading}
            startIcon={loading ? <CircularProgress size={18} color="inherit" /> : <AddRoundedIcon />}
            sx={{
              minWidth: 140,
              boxShadow: '0 0 20px rgba(16, 231, 96, 0.35)',
            }}
          >
            {loading ? 'Saving...' : 'Save Workout'}
          </Button>
        </Box>
      </Box>
    </Dialog>
  );
};

export default ActivityModal;
