export interface User {
	id: number;
	email: string;
	fullName: string;
	phoneNumber: string;
	role: string;
	isActive: boolean;
}

export interface Institution {
	id: number;
	institutionName: string;
	institutionType: string;
	licenseNumber: string;
	location: string;
	sizeRange: string;
	userId: number;
	createdAt: string;
	updatedAt: string;
}

export interface ApiErrorResponse {
	data?: {
		message?: string;
	};
	status?: number;
}

export interface ApiError extends Error {
	response?: ApiErrorResponse;
}
