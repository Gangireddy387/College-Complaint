import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { principalService } from '../../services/principal.service';

// Async thunks
export const getCollegeProfile = createAsyncThunk(
  'college/getCollegeProfile',
  async (_, { rejectWithValue }) => {
    try {
      const response = await principalService.getCollegeProfile();
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch college profile');
    }
  }
);

export const createCollege = createAsyncThunk(
  'college/createCollege',
  async (collegeData, { rejectWithValue }) => {
    try {
      const response = await principalService.createCollege(collegeData);
      return response.data.college;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to create college');
    }
  }
);

export const updateCollegeProfile = createAsyncThunk(
  'college/updateCollegeProfile',
  async (collegeData, { rejectWithValue }) => {
    try {
      const response = await principalService.updateCollegeProfile(collegeData);
      return response.data.college;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to update college profile');
    }
  }
);

const initialState = {
  college: null,
  isLoading: false,
  error: null,
};

const collegeSlice = createSlice({
  name: 'college',
  initialState,
  reducers: {
    clearCollegeError: (state) => {
      state.error = null;
    },
    setCollegeLoading: (state, action) => {
      state.isLoading = action.payload;
    },
    clearCollegeData: (state) => {
      state.college = null;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Get College Profile
      .addCase(getCollegeProfile.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getCollegeProfile.fulfilled, (state, action) => {
        state.isLoading = false;
        state.college = action.payload;
      })
      .addCase(getCollegeProfile.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      // Create College
      .addCase(createCollege.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(createCollege.fulfilled, (state, action) => {
        state.isLoading = false;
        state.college = action.payload;
      })
      .addCase(createCollege.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      // Update College Profile
      .addCase(updateCollegeProfile.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(updateCollegeProfile.fulfilled, (state, action) => {
        state.isLoading = false;
        state.college = action.payload;
      })
      .addCase(updateCollegeProfile.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });
  },
});

export const { clearCollegeError, setCollegeLoading, clearCollegeData } = collegeSlice.actions;
export default collegeSlice.reducer; 