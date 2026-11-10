import React from 'react';
import {
  Box,
  TextField,
  InputAdornment,
  Chip,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  IconButton,
  ToggleButtonGroup,
  ToggleButton,
  Typography,
} from '@mui/material';
import SearchRoundedIcon from '@mui/icons-material/SearchRounded';
import ClearRoundedIcon from '@mui/icons-material/ClearRounded';
import ViewModuleRoundedIcon from '@mui/icons-material/ViewModuleRounded';
import ViewListRoundedIcon from '@mui/icons-material/ViewListRounded';
import FilterListRoundedIcon from '@mui/icons-material/FilterListRounded';
import { ACTIVITY_CONFIGS } from '../utils/activityUtils';

const ActivityFilters = ({
  searchQuery,
  onSearchChange,
  selectedType,
  onTypeChange,
  sortBy,
  onSortChange,
  viewMode,
  onViewModeChange,
  activities = [],
}) => {
  // Compute counts per type
  const typeCounts = activities.reduce((acc, act) => {
    const t = (act.type || 'OTHER').toUpperCase();
    acc[t] = (acc[t] || 0) + 1;
    return acc;
  }, {});

  const filterOptions = [
    { key: 'ALL', label: 'All Workouts', count: activities.length },
    ...Object.entries(ACTIVITY_CONFIGS).map(([key, config]) => ({
      key,
      label: config.label,
      count: typeCounts[key] || 0,
      color: config.color,
    })),
  ].filter((item) => item.key === 'ALL' || item.count > 0 || ['RUNNING', 'CYCLING', 'SWIMMING', 'HIIT', 'STRETCHING'].includes(item.key));

  return (
    <Box sx={{ mb: 3 }}>
      {/* Top Controls Row: Search + Sort + View Mode */}
      <Box
        sx={{
          display: 'flex',
          flexDirection: { xs: 'column', md: 'row' },
          gap: 2,
          justifyContent: 'space-between',
          alignItems: { xs: 'stretch', md: 'center' },
          mb: 2,
        }}
      >
        {/* Search Input */}
        <TextField
          size="small"
          placeholder="Search workouts by name or type..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          sx={{
            flexGrow: 1,
            maxWidth: { md: 440 },
          }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchRoundedIcon sx={{ color: '#94A3B8', fontSize: 20 }} />
              </InputAdornment>
            ),
            endAdornment: searchQuery ? (
              <InputAdornment position="end">
                <IconButton size="small" onClick={() => onSearchChange('')} sx={{ color: '#94A3B8' }}>
                  <ClearRoundedIcon fontSize="small" />
                </IconButton>
              </InputAdornment>
            ) : null,
          }}
        />

        {/* Right Controls: Sort Dropdown & View Mode Switcher */}
        <Box sx={{ display: 'flex', gap: 1.5, alignItems: 'center', justifyContent: 'flex-end' }}>
          <FormControl size="small" sx={{ minWidth: 160 }}>
            <Select
              value={sortBy}
              onChange={(e) => onSortChange(e.target.value)}
              displayEmpty
              sx={{
                fontSize: '0.825rem',
                color: '#F8FAFC',
                bgcolor: 'rgba(15, 23, 42, 0.7)',
              }}
            >
              <MenuItem value="newest">Newest First</MenuItem>
              <MenuItem value="oldest">Oldest First</MenuItem>
              <MenuItem value="calories_desc">Highest Calories</MenuItem>
              <MenuItem value="duration_desc">Longest Duration</MenuItem>
            </Select>
          </FormControl>

          {/* Grid vs List View Toggle */}
          <ToggleButtonGroup
            value={viewMode}
            exclusive
            onChange={(e, val) => val && onViewModeChange(val)}
            size="small"
            sx={{
              bgcolor: 'rgba(15, 23, 42, 0.7)',
              p: 0.3,
              borderRadius: '10px',
              border: '1px solid rgba(255, 255, 255, 0.08)',
              '& .MuiToggleButton-root': {
                border: 'none',
                color: '#94A3B8',
                p: 0.8,
                borderRadius: '8px',
                '&.Mui-selected': {
                  bgcolor: 'rgba(16, 231, 96, 0.15)',
                  color: '#10E760',
                },
              },
            }}
          >
            <ToggleButton value="grid" aria-label="grid view">
              <ViewModuleRoundedIcon fontSize="small" />
            </ToggleButton>
            <ToggleButton value="list" aria-label="list view">
              <ViewListRoundedIcon fontSize="small" />
            </ToggleButton>
          </ToggleButtonGroup>
        </Box>
      </Box>

      {/* Filter Chips Carousel/Row */}
      <Box
        sx={{
          display: 'flex',
          gap: 1,
          overflowX: 'auto',
          pb: 1,
          pt: 0.5,
          '::-webkit-scrollbar': { height: 4 },
        }}
      >
        {filterOptions.map((opt) => {
          const isSelected = selectedType === opt.key;
          return (
            <Chip
              key={opt.key}
              label={
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.8 }}>
                  <span>{opt.label}</span>
                  <Typography
                    component="span"
                    sx={{
                      fontSize: '0.7rem',
                      px: 0.6,
                      py: 0.1,
                      borderRadius: '5px',
                      bgcolor: isSelected ? 'rgba(6, 23, 11, 0.3)' : 'rgba(255, 255, 255, 0.08)',
                      color: isSelected ? '#06170B' : '#94A3B8',
                      fontWeight: 700,
                    }}
                  >
                    {opt.count}
                  </Typography>
                </Box>
              }
              onClick={() => onTypeChange(opt.key)}
              sx={{
                bgcolor: isSelected ? '#10E760' : 'rgba(15, 23, 42, 0.7)',
                color: isSelected ? '#06170B' : '#94A3B8',
                fontWeight: isSelected ? 700 : 500,
                border: isSelected ? '1px solid #10E760' : '1px solid rgba(255, 255, 255, 0.08)',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                '&:hover': {
                  bgcolor: isSelected ? '#00D650' : 'rgba(255, 255, 255, 0.08)',
                  color: isSelected ? '#06170B' : '#F8FAFC',
                },
              }}
            />
          );
        })}
      </Box>
    </Box>
  );
};

export default ActivityFilters;
