import { createTheme } from '@mui/material/styles';

export const theme = createTheme({
  palette: {
    mode: 'dark',
    background: {
      default: '#070B14',
      paper: '#0F172A',
      elevated: '#141E33',
      subtle: '#0B1220',
    },
    primary: {
      main: '#10E760', // Vibrant neon-lime
      light: '#4EFA8F',
      dark: '#00B843',
      contrastText: '#06170B',
    },
    secondary: {
      main: '#38BDF8', // Cyan accent
      light: '#7DD3FC',
      dark: '#0284C7',
      contrastText: '#082F49',
    },
    accent: {
      lime: '#10E760',
      cyan: '#06B6D4',
      orange: '#FB923C',
      blue: '#3B82F6',
      red: '#EF4444',
      purple: '#A855F7',
      amber: '#F59E0B',
      pink: '#EC4899',
    },
    text: {
      primary: '#F8FAFC',
      secondary: '#94A3B8',
      disabled: '#475569',
    },
    divider: 'rgba(255, 255, 255, 0.07)',
    action: {
      hover: 'rgba(16, 231, 96, 0.06)',
      selected: 'rgba(16, 231, 96, 0.12)',
    },
  },
  typography: {
    fontFamily: '"Plus Jakarta Sans", "Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    h1: { fontWeight: 800, letterSpacing: '-0.025em' },
    h2: { fontWeight: 800, letterSpacing: '-0.025em' },
    h3: { fontWeight: 700, letterSpacing: '-0.02em' },
    h4: { fontWeight: 700, letterSpacing: '-0.02em' },
    h5: { fontWeight: 700, letterSpacing: '-0.015em' },
    h6: { fontWeight: 600, letterSpacing: '-0.01em' },
    subtitle1: { fontWeight: 500, color: '#94A3B8' },
    subtitle2: { fontWeight: 500, color: '#94A3B8' },
    body1: { fontSize: '0.95rem', lineHeight: 1.6 },
    body2: { fontSize: '0.85rem', lineHeight: 1.5, color: '#94A3B8' },
    button: { textTransform: 'none', fontWeight: 600, letterSpacing: '0.01em' },
  },
  shape: {
    borderRadius: 14,
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          backgroundColor: '#070B14',
          color: '#F8FAFC',
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          backgroundColor: '#0F172A',
          backgroundImage: 'linear-gradient(180deg, rgba(20, 30, 51, 0.6) 0%, rgba(15, 23, 42, 0.95) 100%)',
          borderRadius: 18,
          border: '1px solid rgba(255, 255, 255, 0.07)',
          boxShadow: '0 8px 30px rgba(0, 0, 0, 0.35)',
          backdropFilter: 'blur(12px)',
          transition: 'all 0.25s cubic-bezier(0.4, 0, 0.2, 1)',
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: 'none',
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          padding: '8px 20px',
          fontWeight: 600,
          boxShadow: 'none',
          transition: 'all 0.2s ease-in-out',
        },
        containedPrimary: {
          backgroundColor: '#10E760',
          color: '#051408',
          '&:hover': {
            backgroundColor: '#00D650',
            boxShadow: '0 0 20px rgba(16, 231, 96, 0.35)',
            transform: 'translateY(-1px)',
          },
        },
        outlinedPrimary: {
          borderColor: 'rgba(16, 231, 96, 0.4)',
          color: '#10E760',
          '&:hover': {
            borderColor: '#10E760',
            backgroundColor: 'rgba(16, 231, 96, 0.08)',
          },
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          fontWeight: 600,
        },
      },
    },
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          backgroundColor: 'rgba(11, 18, 32, 0.8)',
          '& fieldset': {
            borderColor: 'rgba(255, 255, 255, 0.1)',
            transition: 'border-color 0.2s ease',
          },
          '&:hover fieldset': {
            borderColor: 'rgba(16, 231, 96, 0.4)',
          },
          '&.Mui-focused fieldset': {
            borderColor: '#10E760',
            borderWidth: '1.5px',
          },
        },
      },
    },
    MuiDialog: {
      styleOverrides: {
        paper: {
          backgroundColor: '#0F172A',
          backgroundImage: 'linear-gradient(180deg, #141F36 0%, #0F172A 100%)',
          borderRadius: 20,
          border: '1px solid rgba(255, 255, 255, 0.1)',
          boxShadow: '0 24px 60px rgba(0, 0, 0, 0.65)',
        },
      },
    },
  },
});
