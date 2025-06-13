import { api } from "./axios";
import { type Institution } from "@/types/api.types";

export interface CreateInstitutionPayload {
	institutionName: string;
	institutionType: string;
	sizeRange: string;
	location: string;
	licenseNumber: string;
	userId: number | undefined;
}

export const create = async (data: CreateInstitutionPayload) => {
	const response = await api.post("/institutions", data);
	return response.data;
};

export const getByUser = async (
	userId: number | undefined
): Promise<Institution[]> => {
	const response = await api.get(`/institutions/user/${userId}`);
	return response.data;
};
