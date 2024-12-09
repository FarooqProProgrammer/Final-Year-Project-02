// store.ts
import { configureStore } from '@reduxjs/toolkit';
import { setupListeners } from '@reduxjs/toolkit/query';
import { apiSlice } from './services/apiSlice'; // Replace with the correct path to your API slice

// Configure the store
export const store = configureStore({
  reducer: {
    [apiSlice.reducerPath]: apiSlice.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(apiSlice.middleware),
});

// Optional: Enable listener behaviors
setupListeners(store.dispatch);

// Export store type
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
