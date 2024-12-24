// import { createSlice } from "@reduxjs/toolkit";

// const initialState = {
//   holdings: [],
//   filteredHoldings: [],
//   loading: false,
//   error: null,
//   filters: {
//     stockName: "",
//     min: 0,
//     max: Infinity,
//   },
// };

// const holdingsSlice = createSlice({
//   name: "holdings",
//   initialState,
//   reducers: {
//     fetchHoldingsStart(state) {
//       state.loading = true;
//       state.error = null;
//     },
//     fetchHoldingsSuccess(state, action) {
//       state.holdings = action.payload;
//       state.filteredHoldings = action.payload;
//       state.loading = false;
//     },
//     fetchHoldingsFailure(state, action) {
//       state.loading = false;
//       state.error = action.payload;
//     },
//     updateFilters(state, action) {
//       const { key, value } = action.payload;
//       state.filters[key] = value;
//     },
//     filterHoldings(state) {
//       const { stockName, min, max } = state.filters;
//       state.filteredHoldings = state.holdings.filter(
//         (stock) =>
//           stock.name.toLowerCase().includes(stockName.toLowerCase()) &&
//           stock.price >= min &&
//           stock.price <= max
//       );
//     },
//   },
// });

// export const {
//   fetchHoldingsStart,
//   fetchHoldingsSuccess,
//   fetchHoldingsFailure,
//   updateFilters,
//   filterHoldings,
// } = holdingsSlice.actions;

// export const fetchHoldings = () => async (dispatch) => {
//   dispatch(fetchHoldingsStart());
//   try {
//     // Simulated API call
//     const userHoldings = [
//       { id: 1, name: "Apple", quantity: 50, price: 175.5 },
//       { id: 2, name: "Tesla", quantity: 30, price: 272.3 },
//       { id: 3, name: "Microsoft", quantity: 20, price: 315.0 },
//       { id: 4, name: "Amazon", quantity: 15, price: 144.7 },
//       { id: 5, name: "Google", quantity: 25, price: 137.6 },
//       { id: 6, name: "Meta", quantity: 40, price: 350.1 },
//       { id: 7, name: "NVIDIA", quantity: 10, price: 490.2 },
//       { id: 8, name: "Netflix", quantity: 35, price: 400.5 },
//       { id: 9, name: "Adobe", quantity: 18, price: 570.3 },
//       { id: 10, name: "Intel", quantity: 60, price: 34.2 },
//     ];
//     setTimeout(() => {
//       dispatch(fetchHoldingsSuccess(userHoldings));
//     }, 1000);
//   } catch (error) {
//     dispatch(fetchHoldingsFailure("Failed to fetch holdings."));
//   }
// };

// // Selectors
// export const selectHoldings = (state) => state.holdings.holdings;
// export const selectFilteredHoldings = (state) => state.holdings.filteredHoldings;
// export const selectLoading = (state) => state.holdings.loading;
// export const selectError = (state) => state.holdings.error;

// export default holdingsSlice.reducer;









import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  holdings: [],
  filteredHoldings: [],
  sortOrder: "asc",
};

const holdingsSlice = createSlice({
  name: "holdings",
  initialState,
  reducers: {
    setHoldings(state, action) {
      state.holdings = action.payload;
      state.filteredHoldings = action.payload;
    },
    filterHoldings(state, action) {
      const { nameFilter, quantityRange } = action.payload;
      state.filteredHoldings = state.holdings.filter(
        (holding) =>
          holding.name.toLowerCase().includes(nameFilter.toLowerCase()) &&
          holding.quantity >= quantityRange.min &&
          holding.quantity <= quantityRange.max
      );
    },
    sortHoldings(state, action) {
      const { key } = action.payload;
      state.sortOrder = state.sortOrder === "asc" ? "desc" : "asc";
      state.filteredHoldings = [...state.filteredHoldings].sort((a, b) => {
        if (a[key] < b[key]) return state.sortOrder === "asc" ? -1 : 1;
        if (a[key] > b[key]) return state.sortOrder === "asc" ? 1 : -1;
        return 0;
      });
    },
  },
});

export const { setHoldings, filterHoldings, sortHoldings } = holdingsSlice.actions;
export default holdingsSlice.reducer;
