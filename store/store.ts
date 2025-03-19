import { configureStore } from '@reduxjs/toolkit';
import taskReducer from './slices/taskSlice';

export const store = configureStore({
  reducer: {
    tasks: taskReducer, // you can add more slices here later
  },
});

// Infer the `RootState` and `AppDispatch` types for use in your app
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;