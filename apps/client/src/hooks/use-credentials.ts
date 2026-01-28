import { credentialApi } from "@/lib/api";
import { useEffect, useState } from "react";
import type { Credential } from "common/types";

const useCredentials = () => {
	const [credentials, setCredentials] = useState<Credential[]>([]);
	const fetchCredentials = async () => {
		const response = await credentialApi.getAll();
		setCredentials(response.credentials);
	};
	useEffect(() => {
		fetchCredentials();
	}, []);
	return { credentials, refetch: fetchCredentials };
};

export default useCredentials;
