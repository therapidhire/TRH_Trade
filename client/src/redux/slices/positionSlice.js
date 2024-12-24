import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

// Async thunk to simulate fetching stocks data
export const fetchStocks = createAsyncThunk("position/fetchStocks", async () => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const dummyData = [
        { id: 1, name: "Apple", symbol: "AAPL", quantity: 50, price: 175.5, purchaseDate: "2023-01-15" },
        { id: 2, name: "Tesla", symbol: "TSLA", quantity: 30, price: 272.3, purchaseDate: "2023-03-20" },
        { id: 3, name: "Microsoft", symbol: "MSFT", quantity: 20, price: 315.0, purchaseDate: "2022-12-05" },
        { id: 4, name: "Amazon", symbol: "AMZN", quantity: 15, price: 144.7, purchaseDate: "2022-10-30" },
        { id: 5, name: "Google", symbol: "GOOGL", quantity: 25, price: 137.6, purchaseDate: "2023-05-01" },
      ];
      resolve(dummyData);
    }, 1000);
  });
});

const positionSlice = createSlice({
  name: "position",
  initialState: {
    stocks: [],
    loading: false,
    error: null,
    sortConfig: { key: null, direction: null },
  },
  reducers: {
    sortStocks(state, action) {
      const { key } = action.payload;
      let direction = "ascending";
      if (state.sortConfig.key === key && state.sortConfig.direction === "ascending") {
        direction = "descending";
      }
      state.sortConfig = { key, direction };

      state.stocks = [...state.stocks].sort((a, b) => {
        if (a[key] < b[key]) return direction === "ascending" ? -1 : 1;
        if (a[key] > b[key]) return direction === "ascending" ? 1 : -1;
        return 0;
      });
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchStocks.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchStocks.fulfilled, (state, action) => {
        state.loading = false;
        state.stocks = action.payload;
      })
      .addCase(fetchStocks.rejected, (state) => {
        state.loading = false;
        state.error = "Failed to fetch stocks. Please try again later.";
      });
  },
});

export const { sortStocks } = positionSlice.actions;
export default positionSlice.reducer;
