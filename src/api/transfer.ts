import { api } from "./axios";

export interface GenerateCodeResponse {
	message: string;
    sessionId: string;
    code: string;
    qrCode: string;
    expiresAt: string;
}

export const generateCode = async () => {
	const response = await api.post("/transfer/generate-code");
	return response.data;
};

export interface ValidateCodePayload {
    code: string;
}

export interface ValidateCodeResponse {
    message: string;
    sessionId: string;
    institutionId: string;
    expiresAt: string;
    wsUrl: string;
}

export const validateCode = async (data: ValidateCodePayload) => {
    const response = await api.post("/transfer/validate-code", data);
    return response.data;
};

export interface TransferSession {
    id: string;
    institutionId: number;
    createdBy: string;
    status: "waiting" | "connected" | "completed" | "cancelled"
    isActive: boolean;
    createdAt: string;
    connectedAt: string;
    completedAt: string;
    expiresAt: string;
}

export const getTransferSessions = async () => {
    const response = await api.get("/transfer/sessions");
    return response.data;
};

export interface TransferSessionStatus {
    id: string;
    institutionId: number;
    createdBy: string;
    status: "waiting" | "connected" | "completed" | "cancelled";
    isActive: boolean;
    createdAt: string;
    connectedAt: string;
    completedAt: string;
    expiresAt: string;
}

export const getTransferSessionStatus = async (sessionId: string) => {
    const response = await api.get(`/transfer/sessions/${sessionId}`);
    return response.data;
};

export const cancelTransferSession = async (sessionId: string) => {
    const response = await api.patch(`/transfer/sessions/${sessionId}/cancel`);
    return response.data;
};
