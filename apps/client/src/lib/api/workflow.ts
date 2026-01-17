import { apiClient } from "./client";
import { CreateWorkflowSchema, UpdateWorkflowSchemaBody } from "common/types";
import { z } from "zod";

export const workflowApi = {
	create: async (data: z.infer<typeof CreateWorkflowSchema>) => {
		const response = await apiClient.post("/workflow", data);
		return response.data;
	},
	getAll: async () => {
		const response = await apiClient.get("/workflow");
		return response.data;
	},
	getById: async (id: string) => {
		const response = await apiClient.get(`/workflow/${id}`);
		return response.data;
	},
	update: async (
		id: string,
		data: z.infer<typeof UpdateWorkflowSchemaBody>,
	) => {
		const response = await apiClient.patch(`/workflow/${id}`, data);
		return response.data;
	},
	delete: async (id: string) => {
		const response = await apiClient.delete(`/workflow/${id}`);
		return response.data;
	},
};
