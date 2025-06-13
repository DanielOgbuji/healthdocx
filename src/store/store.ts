import { configureStore } from "@reduxjs/toolkit";
import onboardingReducer from "@/features/OnboardingSlice";
import authReducer from "@/features/authSlice";

export const store = configureStore({
	reducer: {
		onboarding: onboardingReducer,
		auth: authReducer,
	},
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
