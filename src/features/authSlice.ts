import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

interface User {
	id: number;
	email: string;
	fullName: string;
	phoneNumber: string;
	role: string;
	isActive: boolean;
}

interface AuthState {
	token: string | null;
	user: User | null;
}

const initialState: AuthState = {
	token: localStorage.getItem("token"),
	user: null,
};

const authSlice = createSlice({
	name: "auth",
	initialState,
	reducers: {
		loginSuccess(state, action: PayloadAction<{ token: string; user: User }>) {
			state.token = action.payload.token;
			state.user = action.payload.user;
			localStorage.setItem("token", action.payload.token);
		},
		logout(state) {
			state.token = null;
			state.user = null;
			localStorage.removeItem("token");
		},
		setUser(state, action: PayloadAction<User>) {
			state.user = action.payload;
		},
	},
});

export const { loginSuccess, logout, setUser } = authSlice.actions;
export default authSlice.reducer;
