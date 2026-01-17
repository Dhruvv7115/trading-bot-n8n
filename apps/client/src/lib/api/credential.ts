import { apiClient } from "./client";
import {
	CreateCredentialSchemaBody,
	UpdateCredentialSchemaBody,
} from "common/types";
import { z } from "zod";

export const credentialApi = {
	create: async (data: z.infer<typeof CreateCredentialSchemaBody>) => {
		const response = await apiClient.post("/credential", data);
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
