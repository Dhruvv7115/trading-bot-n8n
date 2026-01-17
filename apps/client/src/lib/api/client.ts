import axios from "axios";
const BASE_URL = import.meta.env.VITE_BACKEND_URL;

export const apiClient = axios.create({
	baseURL: BASE_URL,
	headers: {
		"Content-Type": "application/json",
		Authorization: `Bearer ${localStorage.getItem("token")}`,
	},
});
