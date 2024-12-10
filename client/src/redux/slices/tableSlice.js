import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  data: [], // Table data
  sortOrder: 'asc', // Default sorting order
  isLoading: false, // Loading state for API calls
};

const tableSlice = createSlice({
  name: 'table',
  initialState,
  reducers: {
    setData(state, action) {
      state.data = action.payload; // Set table data
    },
    toggleSortOrder(state) {
      state.sortOrder = state.sortOrder === 'asc' ? 'desc' : 'asc'; // Toggle sort order
    },
    setLoading(state, action) {
      state.isLoading = action.payload; // Set loading state
    },
  },
});

export const { setData, toggleSortOrder, setLoading } = tableSlice.actions;

export default tableSlice.reducer;
