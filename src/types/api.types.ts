export interface User {
	id: string;
	email: string;
	firstName: string;
	lastName: string;
	role: string;
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

export interface PatientRecord {
	id: string;
	institutionId: string;
	patientName: string;
	status: string;
	data: Record<string, unknown>;
	createdAt: string;
	updatedAt: string;
}

export interface AuthResponse {
	authenticationToken: string;
	refreshToken: string;
	user: User;
}

export interface LoginCredentials {
	email: string;
	password: string;
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
