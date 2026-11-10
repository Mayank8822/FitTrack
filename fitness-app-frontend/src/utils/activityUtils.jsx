import React from 'react';
import DirectionsRunRoundedIcon from '@mui/icons-material/DirectionsRunRounded';
import DirectionsBikeRoundedIcon from '@mui/icons-material/DirectionsBikeRounded';
import PoolRoundedIcon from '@mui/icons-material/PoolRounded';
import SelfImprovementRoundedIcon from '@mui/icons-material/SelfImprovementRounded';
import BoltRoundedIcon from '@mui/icons-material/BoltRounded';
import DirectionsWalkRoundedIcon from '@mui/icons-material/DirectionsWalkRounded';
import FitnessCenterRoundedIcon from '@mui/icons-material/FitnessCenterRounded';
import SpaRoundedIcon from '@mui/icons-material/SpaRounded';
import FavoriteRoundedIcon from '@mui/icons-material/FavoriteRounded';
import SportsScoreRoundedIcon from '@mui/icons-material/SportsScoreRounded';

// The 10 enum values accepted by the backend ActivityType enum
export const VALID_BACKEND_ACTIVITY_TYPES = [
  'RUNNING',
  'WALKING',
  'CYCLING',
  'SWIMMING',
  'WEIGHT_TRAINING',
  'YOGA',
  'HIIT',
  'CARDIO',
  'STRETCHING',
  'OTHER',
];

export const ACTIVITY_CONFIGS = {
  RUNNING: {
    label: 'Running',
    icon: DirectionsRunRoundedIcon,
    color: '#FB923C', // vibrant warm orange
    gradient: 'linear-gradient(135deg, #FB923C 0%, #EA580C 100%)',
    bgGlow: 'rgba(251, 146, 60, 0.15)',
    borderGlow: 'rgba(251, 146, 60, 0.35)',
    calsPerMin: 11.5,
  },
  CYCLING: {
    label: 'Cycling',
    icon: DirectionsBikeRoundedIcon,
    color: '#06B6D4', // electric cyan
    gradient: 'linear-gradient(135deg, #06B6D4 0%, #0284C7 100%)',
    bgGlow: 'rgba(6, 182, 212, 0.15)',
    borderGlow: 'rgba(6, 182, 212, 0.35)',
    calsPerMin: 8.5,
  },
  SWIMMING: {
    label: 'Swimming',
    icon: PoolRoundedIcon,
    color: '#3B82F6', // ocean blue
    gradient: 'linear-gradient(135deg, #3B82F6 0%, #1D4ED8 100%)',
    bgGlow: 'rgba(59, 130, 246, 0.15)',
    borderGlow: 'rgba(59, 130, 246, 0.35)',
    calsPerMin: 10.0,
  },
  HIIT: {
    label: 'HIIT',
    icon: BoltRoundedIcon,
    color: '#EF4444', // high energy red
    gradient: 'linear-gradient(135deg, #EF4444 0%, #B91C1C 100%)',
    bgGlow: 'rgba(239, 68, 68, 0.15)',
    borderGlow: 'rgba(239, 68, 68, 0.35)',
    calsPerMin: 12.5,
  },
  STRETCHING: {
    label: 'Stretching',
    icon: SelfImprovementRoundedIcon,
    color: '#A855F7', // zen purple
    gradient: 'linear-gradient(135deg, #A855F7 0%, #7E22CE 100%)',
    bgGlow: 'rgba(168, 85, 247, 0.15)',
    borderGlow: 'rgba(168, 85, 247, 0.35)',
    calsPerMin: 3.5,
  },
  WALKING: {
    label: 'Walking',
    icon: DirectionsWalkRoundedIcon,
    color: '#10E760', // lime green
    gradient: 'linear-gradient(135deg, #10E760 0%, #059669 100%)',
    bgGlow: 'rgba(16, 231, 96, 0.15)',
    borderGlow: 'rgba(16, 231, 96, 0.35)',
    calsPerMin: 4.5,
  },
  WEIGHT_TRAINING: {
    label: 'Weight Training',
    icon: FitnessCenterRoundedIcon,
    color: '#F59E0B', // amber gold
    gradient: 'linear-gradient(135deg, #F59E0B 0%, #D97706 100%)',
    bgGlow: 'rgba(245, 158, 11, 0.15)',
    borderGlow: 'rgba(245, 158, 11, 0.35)',
    calsPerMin: 6.5,
  },
  YOGA: {
    label: 'Yoga',
    icon: SpaRoundedIcon,
    color: '#EC4899', // lotus pink
    gradient: 'linear-gradient(135deg, #EC4899 0%, #BE185D 100%)',
    bgGlow: 'rgba(236, 72, 153, 0.15)',
    borderGlow: 'rgba(236, 72, 153, 0.35)',
    calsPerMin: 4.0,
  },
  CARDIO: {
    label: 'Cardio',
    icon: FavoriteRoundedIcon,
    color: '#F43F5E', // rose
    gradient: 'linear-gradient(135deg, #F43F5E 0%, #E11D48 100%)',
    bgGlow: 'rgba(244, 63, 94, 0.15)',
    borderGlow: 'rgba(244, 63, 94, 0.35)',
    calsPerMin: 9.0,
  },
  OTHER: {
    label: 'Other',
    icon: SportsScoreRoundedIcon,
    color: '#94A3B8', // slate
    gradient: 'linear-gradient(135deg, #94A3B8 0%, #475569 100%)',
    bgGlow: 'rgba(148, 163, 184, 0.15)',
    borderGlow: 'rgba(148, 163, 184, 0.35)',
    calsPerMin: 6.0,
  },
};

export const getActivityConfig = (type) => {
  const normalized = (type || 'OTHER').toUpperCase();
  return ACTIVITY_CONFIGS[normalized] || ACTIVITY_CONFIGS.OTHER;
};

export const normalizeActivityTypeForBackend = (type) => {
  const normalized = (type || 'OTHER').toUpperCase();
  if (VALID_BACKEND_ACTIVITY_TYPES.includes(normalized)) {
    return normalized;
  }
  return 'OTHER';
};

export const estimateCalories = (type, minutes) => {
  const config = getActivityConfig(type);
  const mins = Number(minutes) || 0;
  return Math.round(mins * config.calsPerMin);
};

export const formatDuration = (minutes) => {
  const m = Number(minutes) || 0;
  if (m < 60) return `${m}m`;
  const hrs = Math.floor(m / 60);
  const remaining = m % 60;
  return remaining > 0 ? `${hrs}h ${remaining}m` : `${hrs}h`;
};

export const formatRelativeDate = (dateString) => {
  if (!dateString) return 'Recent';
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return 'Recent';

  const now = new Date();
  const diffMs = now - date;
  const diffSec = Math.floor(diffMs / 1000);
  const diffMin = Math.floor(diffSec / 60);
  const diffHours = Math.floor(diffMin / 60);
  const diffDays = Math.floor(diffHours / 24);

  if (diffSec < 60) return 'Just now';
  if (diffMin < 60) return `${diffMin}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays === 1) return 'Yesterday';
  if (diffDays < 7) return `${diffDays}d ago`;

  return date.toLocaleDateString(undefined, {
    month: 'short',
    day: 'numeric',
    year: date.getFullYear() !== now.getFullYear() ? 'numeric' : undefined,
  });
};
