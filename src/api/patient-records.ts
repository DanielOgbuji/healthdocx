import { api } from "./axios";

export interface PatientRecordPayload {
	image: File;
	recordType: string;
	recordTypeGroup: string;
}

import { type AxiosProgressEvent } from "axios";

export const extract = async (
	data: PatientRecordPayload,
	onUploadProgress?: (progressEvent: AxiosProgressEvent) => void
) => {
	const formData = new FormData();
	formData.append("image", data.image);
	formData.append("recordType", data.recordType);
	formData.append("recordTypeGroup", data.recordTypeGroup);

	const response = await api.post("/patient-records/extract", formData, {
		headers: {
			"Content-Type": "multipart/form-data",
		},
		onUploadProgress,
	});
	return response.data;
};

export const getPatientRecords = async (options?: { signal?: AbortSignal }) => {
	try {
		const response = await api.get("/patient-records", { signal: options?.signal });
		return response.data;
	} catch (error) {
		console.error("Error fetching patient records:", error);
		throw error;
	}
};

export const getPatientRecordByID = async (id: string | null) => {
	try {
		const response = await api.get(`/patient-records/${id}`);
		return response.data;
	} catch (error) {
		console.error("Error fetching patient record:", error);
		throw error;
	}
};
