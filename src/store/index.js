import { configureStore } from '@reduxjs/toolkit';
import computeGraphSlice from './ComputeGraph-slice';

const store = configureStore({
  reducer: {
    computeGraph: computeGraphSlice.reducer,
  },
});

export default store;
