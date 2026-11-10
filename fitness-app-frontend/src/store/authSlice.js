import { createSlice } from '@reduxjs/toolkit';

const getInitialUserId = () => {
  const storedId = localStorage.getItem('userId');
  if (storedId && storedId !== 'undefined' && storedId !== 'null') {
    return storedId;
  }
  const token = localStorage.getItem('token');
  if (token && token.includes('.')) {
    try {
      const parts = token.split('.');
      if (parts.length === 3) {
        const payload = JSON.parse(atob(parts[1]));
        return payload.sub || null;
      }
    } catch {
      // ignore
    }
  }
  return null;
};

const getInitialUser = () => {
  try {
    const raw = localStorage.getItem('user');
    if (!raw || raw === 'undefined' || raw === 'null') return null;
    return JSON.parse(raw);
  } catch {
    return null;
  }
};

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    user: getInitialUser(),
    token: localStorage.getItem('token') || null,
    userId: getInitialUserId(),
  },
  reducers: {
    setCredentials: (state, action) => {
      const user = action.payload?.user;
      const token = action.payload?.token;

      let userId = user?.sub || null;
      if (!userId && token && token.includes('.')) {
        try {
          const parts = token.split('.');
          if (parts.length === 3) {
            const payload = JSON.parse(atob(parts[1]));
            userId = payload.sub || null;
          }
        } catch {
          // ignore
        }
      }

      state.user = user || state.user;
      state.token = token || state.token;
      state.userId = userId || state.userId;

      if (token) localStorage.setItem('token', token);
      if (user) localStorage.setItem('user', JSON.stringify(user));
      if (userId) localStorage.setItem('userId', userId);
    },
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.userId = null;

      localStorage.removeItem('token');
      localStorage.removeItem('user');
      localStorage.removeItem('userId');
    },
  },
});

export const { setCredentials, logout } = authSlice.actions;
export default authSlice.reducer;
