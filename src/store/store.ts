import { configureStore } from '@reduxjs/toolkit';
import formOneReducer from '@/features/forms/FormOneSlice';
import formTwoReducer from '@/features/forms/FormTwoSlice';
import formThreeReducer from '@/features/forms/FormThreeSlice';
import onboardingReducer from '@/features/OnboardingSlice';

export const store = configureStore({
  reducer: {
    formOne: formOneReducer,
    formTwo: formTwoReducer,
    formThree: formThreeReducer,
    onboarding: onboardingReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;