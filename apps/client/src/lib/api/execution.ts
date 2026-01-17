import { apiClient } from "./client";

export const executionApi = {
	getAllByWorkflowId: async (workflowId: string) => {
		const response = await apiClient.get(`/execution/${workflowId}`);
		return response.data;
	},
};
