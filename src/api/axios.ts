import axios from "axios";

const API_BASE_URL = "https://healthdocx-node.onrender.com/api/v1";

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
