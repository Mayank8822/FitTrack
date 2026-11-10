import React from 'react';
import {
  Card,
  CardContent,
  Box,
  Typography,
  IconButton,
  Button,
  Chip,
  Tooltip,
} from '@mui/material';
import DeleteOutlineRoundedIcon from '@mui/icons-material/DeleteOutlineRounded';
import ArrowForwardRoundedIcon from '@mui/icons-material/ArrowForwardRounded';
import TimerRoundedIcon from '@mui/icons-material/TimerRounded';
import LocalFireDepartmentRoundedIcon from '@mui/icons-material/LocalFireDepartmentRounded';
import AutoAwesomeRoundedIcon from '@mui/icons-material/AutoAwesomeRounded';
import CalendarTodayRoundedIcon from '@mui/icons-material/CalendarTodayRounded';
import { getActivityConfig, formatRelativeDate } from '../utils/activityUtils';

const ActivityCard = ({ activity, onDelete, onViewRecommendation, isDeleting }) => {
  const config = getActivityConfig(activity.type);
  const Icon = config.icon;

  const dateDisplay = formatRelativeDate(activity.createdAt || activity.startTime);

  return (
    <Card
      sx={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        position: 'relative',
        p: 2.5,
        backgroundColor: '#0F172A',
        backgroundImage: 'linear-gradient(180deg, rgba(20, 30, 51, 0.7) 0%, rgba(15, 23, 42, 0.95) 100%)',
        borderRadius: '18px',
        border: '1px solid rgba(255, 255, 255, 0.08)',
        boxShadow: '0 8px 30px rgba(0, 0, 0, 0.35)',
        transition: 'all 0.25s cubic-bezier(0.4, 0, 0.2, 1)',
        '&:hover': {
          transform: 'translateY(-4px)',
          boxShadow: `0 16px 36px rgba(0, 0, 0, 0.5), 0 0 24px ${config.color}20`,
          borderColor: config.color,
          '& .recommendation-btn': {
            backgroundColor: '#10E760',
            color: '#06170B',
            boxShadow: '0 0 16px rgba(16, 231, 96, 0.4)',
          },
        },
      }}
    >
      {/* Top Row: Icon + Type + Delete Action */}
      <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', mb: 2 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
          <Box
            sx={{
              width: 46,
              height: 46,
              borderRadius: '14px',
              bgcolor: config.bgGlow,
              color: config.color,
              border: `1px solid ${config.borderGlow}`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: `0 0 16px ${config.color}20`,
            }}
          >
            <Icon sx={{ fontSize: 26 }} />
          </Box>
          <Box>
            <Typography variant="h6" sx={{ fontWeight: 700, color: '#F8FAFC', lineHeight: 1.2 }}>
              {config.label}
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.6, mt: 0.3 }}>
              <CalendarTodayRoundedIcon sx={{ fontSize: 13, color: '#64748B' }} />
              <Typography variant="caption" sx={{ color: '#64748B', fontWeight: 500 }}>
                {dateDisplay}
              </Typography>
            </Box>
          </Box>
        </Box>

        <Tooltip title="Delete activity">
          <IconButton
            size="small"
            disabled={isDeleting}
            onClick={(e) => {
              e.stopPropagation();
              onDelete(activity.id);
            }}
            sx={{
              color: '#64748B',
              borderRadius: '10px',
              p: 0.8,
              '&:hover': {
                color: '#EF4444',
                bgcolor: 'rgba(239, 68, 68, 0.1)',
              },
            }}
          >
            <DeleteOutlineRoundedIcon fontSize="small" />
          </IconButton>
        </Tooltip>
      </Box>

      {/* Middle Stats Grid: Duration and Calories */}
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: 1.5,
          p: 1.8,
          borderRadius: '14px',
          bgcolor: 'rgba(11, 18, 32, 0.6)',
          border: '1px solid rgba(255, 255, 255, 0.05)',
          mb: 2.5,
        }}
      >
        {/* Duration */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Box
            sx={{
              width: 32,
              height: 32,
              borderRadius: '8px',
              bgcolor: 'rgba(56, 189, 248, 0.1)',
              color: '#38BDF8',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <TimerRoundedIcon sx={{ fontSize: 18 }} />
          </Box>
          <Box>
            <Typography variant="caption" sx={{ color: '#64748B', display: 'block', fontSize: '0.7rem' }}>
              Duration
            </Typography>
            <Typography variant="body2" sx={{ fontWeight: 700, color: '#F8FAFC' }}>
              {activity.duration} min
            </Typography>
          </Box>
        </Box>

        {/* Calories */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Box
            sx={{
              width: 32,
              height: 32,
              borderRadius: '8px',
              bgcolor: 'rgba(251, 146, 60, 0.1)',
              color: '#FB923C',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <LocalFireDepartmentRoundedIcon sx={{ fontSize: 18 }} />
          </Box>
          <Box>
            <Typography variant="caption" sx={{ color: '#64748B', display: 'block', fontSize: '0.7rem' }}>
              Calories
            </Typography>
            <Typography variant="body2" sx={{ fontWeight: 700, color: '#F8FAFC' }}>
              {activity.caloriesBurned || 0} kcal
            </Typography>
          </Box>
        </Box>
      </Box>

      {/* Footer / Actions: AI Insights button */}
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', pt: 1 }}>
        <Chip
          label="AI Analyzed"
          size="small"
          icon={<AutoAwesomeRoundedIcon sx={{ fontSize: '13px !important', color: '#10E760 !important' }} />}
          sx={{
            height: 24,
            fontSize: '0.7rem',
            fontWeight: 600,
            bgcolor: 'rgba(16, 231, 96, 0.08)',
            color: '#10E760',
            border: '1px solid rgba(16, 231, 96, 0.2)',
          }}
        />

        <Button
          className="recommendation-btn"
          variant="contained"
          size="small"
          endIcon={<ArrowForwardRoundedIcon sx={{ fontSize: 16 }} />}
          onClick={(e) => {
            e.stopPropagation();
            onViewRecommendation(activity.id);
          }}
          sx={{
            borderRadius: '10px',
            px: 1.8,
            py: 0.6,
            fontSize: '0.8rem',
            fontWeight: 700,
            bgcolor: 'rgba(255, 255, 255, 0.06)',
            color: '#F8FAFC',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            transition: 'all 0.2s ease',
          }}
        >
          Insights
        </Button>
      </Box>
    </Card>
  );
};

export default ActivityCard;
