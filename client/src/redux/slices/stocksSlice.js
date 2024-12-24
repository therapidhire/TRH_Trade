import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  stocks: [],
  filteredStocks: [],
  sortOrder: "asc",
};

const stocksSlice = createSlice({
  name: "stocks",
  initialState,
  reducers: {
    setStocks(state, action) {
      state.stocks = action.payload;
      state.filteredStocks = action.payload;
    },
    filterStocks(state, action) {
      const { nameFilter, priceRange } = action.payload;
      state.filteredStocks = state.stocks.filter(
        (stock) =>
          stock.name.toLowerCase().includes(nameFilter.toLowerCase()) 
          // stock.price >= priceRange.min &&
          // stock.price <= priceRange.max
      );
    },
    sortStocks(state, action) {
      const { key } = action.payload;
      state.sortOrder = state.sortOrder === "asc" ? "desc" : "asc";
      state.filteredStocks = [...state.filteredStocks].sort((a, b) => {
        if (a[key] < b[key]) return state.sortOrder === "asc" ? -1 : 1;
        if (a[key] > b[key]) return state.sortOrder === "asc" ? 1 : -1;
        return 0;
      });
    },
  },
});

export const { setStocks, filterStocks, sortStocks } = stocksSlice.actions;
export default stocksSlice.reducer;
