import React, { useContext, useState } from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  Avatar,
  IconButton,
  Menu,
  MenuItem,
  Tooltip,
  Divider,
  useTheme,
  useMediaQuery,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Chip,
} from '@mui/material';
import LogoutRoundedIcon from '@mui/icons-material/LogoutRounded';
import AddRoundedIcon from '@mui/icons-material/AddRounded';
import DirectionsRunRoundedIcon from '@mui/icons-material/DirectionsRunRounded';
import DashboardRoundedIcon from '@mui/icons-material/DashboardRounded';
import BarChartRoundedIcon from '@mui/icons-material/BarChartRounded';
import MenuRoundedIcon from '@mui/icons-material/MenuRounded';
import PersonOutlineRoundedIcon from '@mui/icons-material/PersonOutlineRounded';
import BoltRoundedIcon from '@mui/icons-material/BoltRounded';
import GroupsRoundedIcon from '@mui/icons-material/GroupsRounded';
import AutoAwesomeRoundedIcon from '@mui/icons-material/AutoAwesomeRounded';
import { AuthContext } from 'react-oauth2-code-pkce';

const ActivitiesPageHeader = ({ onOpenAddModal, activeTab = 'dashboard', onTabChange }) => {
  const { logOut, tokenData } = useContext(AuthContext);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const [anchorElUser, setAnchorElUser] = useState(null);
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);

  const userName =
    tokenData?.preferred_username ||
    tokenData?.name ||
    tokenData?.given_name ||
    'Athlete';
  const userEmail = tokenData?.email || 'authenticated user';
  const userInitial = userName.charAt(0).toUpperCase();

  const handleOpenUserMenu = (event) => setAnchorElUser(event.currentTarget);
  const handleCloseUserMenu = () => setAnchorElUser(null);

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: DashboardRoundedIcon },
    { id: 'analytics', label: 'Analytics', icon: BarChartRoundedIcon },
    { id: 'activities', label: 'Workouts', icon: DirectionsRunRoundedIcon },
    { id: 'community', label: 'Community', icon: GroupsRoundedIcon },
    { id: 'mlcoach', label: 'ML Coach', icon: AutoAwesomeRoundedIcon },
    { id: 'profile', label: 'Profile', icon: PersonOutlineRoundedIcon },
  ];

  return (
    <AppBar
      position="sticky"
      sx={{
        backgroundColor: 'rgba(7, 11, 20, 0.85)',
        backdropFilter: 'blur(16px)',
        borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
        boxShadow: '0 4px 30px rgba(0, 0, 0, 0.4)',
        zIndex: (theme) => theme.zIndex.drawer + 1,
      }}
      elevation={0}
    >
      <Toolbar
        sx={{
          maxWidth: 1320,
          width: '100%',
          mx: 'auto',
          px: { xs: 2, sm: 3, md: 4 },
          minHeight: { xs: 68, sm: 74 },
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        {/* Left: Brand Logo */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          {isMobile && (
            <IconButton
              edge="start"
              color="inherit"
              aria-label="open drawer"
              onClick={() => setMobileDrawerOpen(true)}
              sx={{
                mr: 0.5,
                color: '#94A3B8',
                '&:hover': { color: '#10E760', bgcolor: 'rgba(16, 231, 96, 0.08)' },
              }}
            >
              <MenuRoundedIcon />
            </IconButton>
          )}

          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 1.5,
              cursor: 'pointer',
              userSelect: 'none',
            }}
            onClick={() => onTabChange && onTabChange('dashboard')}
          >
            <Box
              sx={{
                width: 42,
                height: 42,
                borderRadius: '12px',
                background: 'linear-gradient(135deg, #10E760 0%, #00B843 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 0 20px rgba(16, 231, 96, 0.45)',
                color: '#06170B',
              }}
            >
              <DirectionsRunRoundedIcon sx={{ fontSize: 28 }} />
            </Box>
            <Box sx={{ display: 'flex', flexDirection: 'column' }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Typography
                  variant="h6"
                  sx={{
                    fontWeight: 800,
                    letterSpacing: '-0.02em',
                    color: '#F8FAFC',
                    fontSize: { xs: '1.15rem', sm: '1.25rem' },
                    lineHeight: 1.1,
                  }}
                >
                  Fit<span style={{ color: '#10E760' }}>Track</span>
                </Typography>
                <Chip
                  label="PRO"
                  size="small"
                  sx={{
                    height: 18,
                    fontSize: '0.65rem',
                    fontWeight: 800,
                    letterSpacing: '0.05em',
                    backgroundColor: 'rgba(16, 231, 96, 0.15)',
                    color: '#10E760',
                    border: '1px solid rgba(16, 231, 96, 0.3)',
                    px: 0.2,
                  }}
                />
              </Box>
              <Typography
                variant="caption"
                sx={{
                  color: '#64748B',
                  fontSize: '0.7rem',
                  fontWeight: 500,
                  letterSpacing: '0.02em',
                  display: { xs: 'none', sm: 'block' },
                }}
              >
                AI-Powered Performance
              </Typography>
            </Box>
          </Box>

          {/* Desktop Navigation */}
          {!isMobile && (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, ml: 4 }}>
              {navItems.map((item) => {
                const IconComponent = item.icon;
                const isActive = activeTab === item.id;
                return (
                  <Button
                    key={item.id}
                    startIcon={<IconComponent sx={{ fontSize: 18 }} />}
                    onClick={() => onTabChange && onTabChange(item.id)}
                    sx={{
                      px: 2,
                      py: 0.8,
                      borderRadius: '10px',
                      color: isActive ? '#10E760' : '#94A3B8',
                      backgroundColor: isActive ? 'rgba(16, 231, 96, 0.1)' : 'transparent',
                      border: isActive ? '1px solid rgba(16, 231, 96, 0.25)' : '1px solid transparent',
                      fontWeight: isActive ? 700 : 500,
                      fontSize: '0.875rem',
                      '&:hover': {
                        color: '#F8FAFC',
                        backgroundColor: 'rgba(255, 255, 255, 0.05)',
                      },
                    }}
                  >
                    {item.label}
                  </Button>
                );
              })}
            </Box>
          )}
        </Box>

        {/* Right: Actions & User Profile */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: { xs: 1, sm: 2 } }}>
          {/* Prominent Log Workout Button */}
          <Button
            variant="contained"
            color="primary"
            startIcon={<AddRoundedIcon />}
            onClick={onOpenAddModal}
            sx={{
              px: { xs: 1.8, sm: 2.6 },
              py: { xs: 0.8, sm: 1 },
              fontSize: { xs: '0.8rem', sm: '0.875rem' },
              fontWeight: 700,
              borderRadius: '12px',
              boxShadow: '0 0 24px rgba(16, 231, 96, 0.35)',
              whiteSpace: 'nowrap',
            }}
          >
            {isMobile ? 'Log' : 'Log Workout'}
          </Button>

          {/* User Profile Avatar / Menu */}
          <Tooltip title={`Signed in as ${userName}`}>
            <IconButton
              onClick={handleOpenUserMenu}
              sx={{
                p: 0.5,
                border: '2px solid rgba(16, 231, 96, 0.4)',
                borderRadius: '14px',
                transition: 'all 0.2s',
                '&:hover': {
                  borderColor: '#10E760',
                  boxShadow: '0 0 16px rgba(16, 231, 96, 0.3)',
                },
              }}
            >
              <Avatar
                sx={{
                  width: 36,
                  height: 36,
                  borderRadius: '11px',
                  bgcolor: '#131D31',
                  color: '#10E760',
                  fontWeight: 700,
                  fontSize: '0.95rem',
                }}
              >
                {userInitial}
              </Avatar>
            </IconButton>
          </Tooltip>

          {/* Quick Logout Button (Desktop) */}
          {!isMobile && (
            <Tooltip title="Log out">
              <IconButton
                onClick={() => logOut()}
                aria-label="Logout"
                sx={{
                  color: '#94A3B8',
                  borderRadius: '12px',
                  border: '1px solid rgba(255, 255, 255, 0.08)',
                  p: 1.1,
                  '&:hover': {
                    color: '#EF4444',
                    borderColor: 'rgba(239, 68, 68, 0.3)',
                    backgroundColor: 'rgba(239, 68, 68, 0.08)',
                  },
                }}
              >
                <LogoutRoundedIcon fontSize="small" />
              </IconButton>
            </Tooltip>
          )}

          {/* User Menu Dropdown */}
          <Menu
            sx={{
              mt: '48px',
              '& .MuiPaper-root': {
                backgroundColor: '#0F172A',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                boxShadow: '0 16px 40px rgba(0, 0, 0, 0.6)',
                borderRadius: '14px',
                minWidth: 220,
                p: 1,
              },
            }}
            id="menu-appbar"
            anchorEl={anchorElUser}
            anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
            keepMounted
            transformOrigin={{ vertical: 'top', horizontal: 'right' }}
            open={Boolean(anchorElUser)}
            onClose={handleCloseUserMenu}
          >
            <Box sx={{ px: 2, py: 1.5 }}>
              <Typography variant="subtitle2" sx={{ fontWeight: 700, color: '#F8FAFC' }}>
                {userName}
              </Typography>
              <Typography
                variant="caption"
                sx={{ color: '#94A3B8', display: 'block', overflow: 'hidden', textOverflow: 'ellipsis' }}
              >
                {userEmail}
              </Typography>
            </Box>
            <Divider sx={{ my: 1, borderColor: 'rgba(255, 255, 255, 0.07)' }} />
            <MenuItem
              onClick={() => {
                handleCloseUserMenu();
                onOpenAddModal();
              }}
              sx={{ borderRadius: '8px', my: 0.5 }}
            >
              <ListItemIcon sx={{ color: '#10E760' }}>
                <AddRoundedIcon fontSize="small" />
              </ListItemIcon>
              <Typography variant="body2">Log Workout</Typography>
            </MenuItem>
            <MenuItem
              onClick={() => {
                handleCloseUserMenu();
                logOut();
              }}
              sx={{
                borderRadius: '8px',
                my: 0.5,
                color: '#EF4444',
                '&:hover': { bgcolor: 'rgba(239, 68, 68, 0.1)' },
              }}
            >
              <ListItemIcon sx={{ color: '#EF4444' }}>
                <LogoutRoundedIcon fontSize="small" />
              </ListItemIcon>
              <Typography variant="body2" sx={{ fontWeight: 600 }}>
                Log out
              </Typography>
            </MenuItem>
          </Menu>
        </Box>
      </Toolbar>

      {/* Mobile Drawer */}
      <Drawer
        anchor="left"
        open={mobileDrawerOpen}
        onClose={() => setMobileDrawerOpen(false)}
        PaperProps={{
          sx: {
            width: 270,
            backgroundColor: '#0F172A',
            backgroundImage: 'none',
            borderRight: '1px solid rgba(255, 255, 255, 0.08)',
            p: 2,
          },
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 3, px: 1 }}>
          <Box
            sx={{
              width: 38,
              height: 38,
              borderRadius: '10px',
              background: 'linear-gradient(135deg, #10E760 0%, #00B843 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#06170B',
            }}
          >
            <DirectionsRunRoundedIcon />
          </Box>
          <Typography variant="h6" sx={{ fontWeight: 800 }}>
            Fit<span style={{ color: '#10E760' }}>Track</span>
          </Typography>
        </Box>

        <Box sx={{ p: 1.5, mb: 2, bgcolor: 'rgba(255, 255, 255, 0.03)', borderRadius: '12px' }}>
          <Typography variant="subtitle2" sx={{ fontWeight: 700, color: '#F8FAFC' }}>
            {userName}
          </Typography>
          <Typography variant="caption" sx={{ color: '#94A3B8' }}>
            {userEmail}
          </Typography>
        </Box>

        <List sx={{ px: 0 }}>
          {navItems.map((item) => {
            const IconComponent = item.icon;
            const isActive = activeTab === item.id;
            return (
              <ListItem key={item.id} disablePadding sx={{ mb: 1 }}>
                <ListItemButton
                  onClick={() => {
                    onTabChange && onTabChange(item.id);
                    setMobileDrawerOpen(false);
                  }}
                  sx={{
                    borderRadius: '10px',
                    color: isActive ? '#10E760' : '#94A3B8',
                    bgcolor: isActive ? 'rgba(16, 231, 96, 0.1)' : 'transparent',
                    border: isActive ? '1px solid rgba(16, 231, 96, 0.25)' : 'none',
                  }}
                >
                  <ListItemIcon sx={{ color: isActive ? '#10E760' : '#94A3B8', minWidth: 40 }}>
                    <IconComponent />
                  </ListItemIcon>
                  <ListItemText
                    primary={item.label}
                    primaryTypographyProps={{ fontWeight: isActive ? 700 : 500 }}
                  />
                </ListItemButton>
              </ListItem>
            );
          })}
        </List>

        <Divider sx={{ my: 2, borderColor: 'rgba(255, 255, 255, 0.08)' }} />

        <Button
          fullWidth
          variant="contained"
          color="primary"
          startIcon={<AddRoundedIcon />}
          onClick={() => {
            setMobileDrawerOpen(false);
            onOpenAddModal();
          }}
          sx={{ mb: 2, py: 1.2 }}
        >
          Log Workout
        </Button>

        <Button
          fullWidth
          variant="outlined"
          color="inherit"
          startIcon={<LogoutRoundedIcon />}
          onClick={() => logOut()}
          sx={{
            color: '#EF4444',
            borderColor: 'rgba(239, 68, 68, 0.3)',
            '&:hover': { bgcolor: 'rgba(239, 68, 68, 0.1)', borderColor: '#EF4444' },
          }}
        >
          Log Out
        </Button>
      </Drawer>
    </AppBar>
  );
};

export default ActivitiesPageHeader;
