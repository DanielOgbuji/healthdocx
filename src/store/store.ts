import { configureStore, combineReducers } from "@reduxjs/toolkit";
import onboardingReducer from "@/features/onboardingSlice";
import { persistStore, persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";
import authReducer from "@/features/authSlice";

const persistConfig = {
	key: "root",
	storage,
	whitelist: ["auth"], // only persist auth slice
};

const rootReducer = combineReducers({
	onboarding: onboardingReducer,
	auth: authReducer,
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
	reducer: persistedReducer,
	middleware: (getDefaultMiddleware) =>
		getDefaultMiddleware({
			serializableCheck: false,
		}),
});

export const persistor = persistStore(store);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
