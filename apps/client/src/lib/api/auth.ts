import { apiClient } from "./client";
import { SignupSchema, SigninSchema } from "common/types";
import { z } from "zod";

export const authApi = {
	signup: async (data: z.infer<typeof SignupSchema>) => {
		const response = await apiClient.post("/auth/signup", data);
		return response.data;
	},
	signin: async (data: z.infer<typeof SigninSchema>) => {
		const response = await apiClient.post("/auth/signin", data);
		return response.data;
	},
};
