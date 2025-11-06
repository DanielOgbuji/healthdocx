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

export interface PatientRecord {
	id: string;
	institutionId: number;
	recordType: string;
	recordCode: string;
	recordTypeGroup:
		| "clinical"
		| "diagnostic"
		| "prescription"
		| "treatment"
		| "administrative";
	patientName: string;
	patientId: string;
	rawFileUrl: string;
	extractedData: Record<string, unknown>;
	status: "pending" | "approved" | "rejected";
	//createdAt: string;
	uploadedAt: string;
}

export interface ApiErrorConfig {
	data?:
		| string
		| {
				email?: string;
				password?: string;
		  };
}

export interface ApiErrorResponse {
	data?: {
		message?: string;
		error?: string;
	};
	status?: number;
}

export interface ApiError extends Error {
	response?: ApiErrorResponse;
	config?: ApiErrorConfig;
}
