// src/store/store.ts
import { configureStore } from '@reduxjs/toolkit';
import onboardingReducer from '../onboardingSlice';

const store = configureStore({
  reducer: {
    onboarding: onboardingReducer,
    // include other reducers here if needed
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export default store;
