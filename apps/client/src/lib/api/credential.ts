import { apiClient } from "./client";
import {
	CreateCredentialSchemaBody,
	GetCredentialSchemaBody,
	UpdateCredentialSchemaBody,
} from "common/types";
import { z } from "zod";

export const credentialApi = {
	create: async (data: z.infer<typeof CreateCredentialSchemaBody>) => {
		const response = await apiClient.post("/credential", data);
		return response.data;
	},
	getAll: async () => {
		const response = await apiClient.get("/credential");
		return response.data;
	},
	getOne: async (id: string) => {
		const response = await apiClient.get(`/credential/${id}`);
		return response.data;
	},
	getByType: async (data: z.infer<typeof GetCredentialSchemaBody>) => {
		const response = await apiClient.get(`/credential/type`, { params: data });
		return response.data;
	},
	update: async (
		id: string,
		data: z.infer<typeof UpdateCredentialSchemaBody>,
	) => {
		const response = await apiClient.patch(`/credential/${id}`, data);
		return response.data;
	},
};
