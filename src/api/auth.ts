import { api } from "./axios";

export interface RegisterPayload {
	email: string;
	password: string;
    role: string;
	fullName: string;
	phoneNumber: string;
	invitationCode: string;
}

export const register = async (data: RegisterPayload) => {
	const response = await api.post("/auth/register", data);
	return response.data;
};

export const login = async (email: string, password: string) => {
	const response = await api.post("/auth/login", { email, password });
	return response.data;
};

export const verifyEmail = async (email: string | null, otp: string) => {
	const response = await api.post("/auth/verify-email", { email, otp });
	return response.data;
};

export const resendVerification = async (email: string | null) => {
	const response = await api.post("/auth/resend-verification", { email });
	return response.data;
};

export const forgotPassword = async (email: string) => {
	const response = await api.post("/auth/forgot-password", { email });
	return response.data;
};

export const resetPassword = async (email: string, otp: string, newPassword: string) => {
	const response = await api.post("/auth/reset-password", { email, otp, newPassword });
	return response.data;
};
