import React from 'react';
import ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux';
import { store } from './store/store';
import App from './App';
import { AuthProvider } from 'react-oauth2-code-pkce';
import { authConfig } from './authConfig';
import { ThemeProvider, CssBaseline, Box, CircularProgress, Typography } from '@mui/material';
import { theme } from './theme';
import './index.css';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <AuthProvider
    authConfig={authConfig}
    loadingComponent={
      <Box
        sx={{
          minHeight: '100vh',
          bgcolor: '#070B14',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 2,
        }}
      >
        <CircularProgress sx={{ color: '#10E760' }} />
        <Typography variant="body2" sx={{ color: '#94A3B8', fontWeight: 600 }}>
          Authenticating with Keycloak...
        </Typography>
      </Box>
    }
  >
    <Provider store={store}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <App />
      </ThemeProvider>
    </Provider>
  </AuthProvider>
);
