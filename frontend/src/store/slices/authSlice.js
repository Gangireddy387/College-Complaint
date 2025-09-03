import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { principalService } from '../../services/principal.service';
import { isTokenExpired, clearSession } from '../../utils/sessionUtils';

// Async thunks
export const loginPrincipal = createAsyncThunk(
  'auth/loginPrincipal',
  async (credentials, { rejectWithValue }) => {
    try {
      const response = await principalService.login(credentials);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Login failed');
    }
  }
);

export const logoutPrincipal = createAsyncThunk(
  'auth/logoutPrincipal',
  async (_, { rejectWithValue }) => {
    try {
      await principalService.logout();
      return null;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Logout failed');
    }
  }
);

export const getPrincipalProfile = createAsyncThunk(
  'auth/getPrincipalProfile',
  async (_, { rejectWithValue }) => {
    try {
      const response = await principalService.getProfile();
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch profile');
    }
  }
);

export const updatePrincipalProfile = createAsyncThunk(
  'auth/updatePrincipalProfile',
  async (profileData, { rejectWithValue }) => {
    try {
      const response = await principalService.updateProfile(profileData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to update profile');
    }
  }
);

const initialState = {
  user: null,
  token: localStorage.getItem('principalToken'),
  isAuthenticated: (() => {
    try {
      const token = localStorage.getItem('principalToken');
      return token && !isTokenExpired(token);
    } catch (error) {
      return false;
    }
  })(),
  isLoading: false,
  error: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    setLoading: (state, action) => {
      state.isLoading = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      // Login
      .addCase(loginPrincipal.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(loginPrincipal.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isAuthenticated = true;
        state.user = action.payload.principal;
        state.token = action.payload.token;
        localStorage.setItem('principalToken', action.payload.token);
      })
      .addCase(loginPrincipal.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      // Logout
      .addCase(logoutPrincipal.fulfilled, (state) => {
        state.user = null;
        state.token = null;
        state.isAuthenticated = false;
        clearSession();
      })
      // Get Profile
      .addCase(getPrincipalProfile.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getPrincipalProfile.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload;
        state.isAuthenticated = true;
      })
      .addCase(getPrincipalProfile.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
        // If profile fetch fails, clear authentication state
        state.user = null;
        state.token = null;
        state.isAuthenticated = false;
        clearSession();
      })
      // Update Profile
      .addCase(updatePrincipalProfile.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(updatePrincipalProfile.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload;
      })
      .addCase(updatePrincipalProfile.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });
  },
});

export const { clearError, setLoading } = authSlice.actions;
export default authSlice.reducer;
