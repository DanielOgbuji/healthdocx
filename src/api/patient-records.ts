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

export const getPatientRecords = async () => {
	try {
		const response = await api.get("/patient-records");
		return response.data;
	} catch (error) {
		console.error("Error fetching patient records:", error);
		throw error;
	}
};
