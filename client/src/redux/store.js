import { configureStore } from '@reduxjs/toolkit';
import tableReducer from './slices/tableSlice'; 
import stocksReducer from './slices/stocksSlice';
import holdingsReducer from './slices/holdingsSlice';
import positionReducer from './slices/positionSlice';
// import historyReducer from './slices/historySlice';


const store = configureStore({
  reducer: {
    table: tableReducer, 
    stocks: stocksReducer,
    holdings: holdingsReducer,
    position: positionReducer,
    // history: historyReducer,
  },
});

export default store;
