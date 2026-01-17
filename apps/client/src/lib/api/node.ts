import { apiClient } from "./client";
import { CreateNodeSchemaBody, UpdateNodeSchemaBody } from "common/types";
import { z } from "zod";

export const nodeApi = {
	create: async (
		workflowId: string,
		data: z.infer<typeof CreateNodeSchemaBody>,
	) => {
		const response = await apiClient.post(`/node/${workflowId}`, data);
		return response.data;
	},
	getAll: async (workflowId: string) => {
		const response = await apiClient.get(`/node/${workflowId}`);
		return response.data;
	},
	getById: async (workflowId: string, nodeId: string) => {
		const response = await apiClient.get(`/node/${workflowId}/${nodeId}`);
		return response.data;
	},
	update: async (
		workflowId: string,
		nodeId: string,
		data: z.infer<typeof UpdateNodeSchemaBody>,
	) => {
		const response = await apiClient.patch(
			`/node/${workflowId}/${nodeId}`,
			data,
		);
		return response.data;
	},
	delete: async (workflowId: string, nodeId: string) => {
		const response = await apiClient.delete(`/node/${workflowId}/${nodeId}`);
		return response.data;
	},
};
