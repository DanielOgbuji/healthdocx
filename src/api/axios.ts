import axios from "axios";
import { toaster } from "@/components/ui/toaster";

export const API_BASE_URL = "https://healthdocx-node.onrender.com/api/v1";

export const api = axios.create({
	baseURL: API_BASE_URL,
});

// Attach token to every request
api.interceptors.request.use((config) => {
	const token = localStorage.getItem("token");
	if (token) {
		config.headers.Authorization = `Bearer ${token}`;
	}
	return config;
});

// Handle 401 errors
api.interceptors.response.use(
	(response) => response,
	(error) => {
		if (error.response && error.response.status === 401) {
			localStorage.removeItem("token");
			//window.location.href = "/sign-in";
			toaster.create({
				title: "Your session timed out",
				description: "Sign in to continue your session.",
				type: "error",
				duration: 5000,
			});
			return;
		}
		return Promise.reject(error);
	}
);
