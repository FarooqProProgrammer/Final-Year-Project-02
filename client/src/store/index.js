import { configureStore } from "@reduxjs/toolkit";
import { setupListeners } from "@reduxjs/toolkit/query";
import rootReducer from "./rootReducer";
import { apiSlice } from "./services/apiSlice";

// Configure Store
const store = configureStore({
  reducer: {
    ...rootReducer, // Spread reducers from rootReducer
    [apiSlice.reducerPath]: apiSlice.reducer, // Add RTK Query slice
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }).concat(apiSlice.middleware), // Add RTK Query middleware
});

// Enable Listeners for RTK Query
setupListeners(store.dispatch);

export { store };
