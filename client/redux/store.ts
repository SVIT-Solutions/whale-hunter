import { configureStore } from '@reduxjs/toolkit';

const rootReducer: any = {};

const store = configureStore({
  reducer: rootReducer,
});

export default store;
