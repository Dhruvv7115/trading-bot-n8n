import { apiClient } from "./client";
import { CreateEdgeSchemaBody } from "common/types";
import { z } from "zod";

export const edgeApi = {
	create: async (
		workflowId: string,
		data: z.infer<typeof CreateEdgeSchemaBody>,
	) => {
		const response = await apiClient.post(`/edge/${workflowId}`, data);
		return response.data;
	},
	delete: async (workflowId: string, edgeId: string) => {
		const response = await apiClient.delete(`/edge/${workflowId}/${edgeId}`);
		return response.data;
	},
	getAll: async (workflowId: string) => {
		const response = await apiClient.get(`/edge/${workflowId}`);
		return response.data;
	},
};
