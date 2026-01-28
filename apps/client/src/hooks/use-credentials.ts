import { credentialApi } from "@/lib/api";
import { useEffect, useState } from "react";
import type { Credential } from "common/types";

const useCredentials = (dependencies: any[] = []) => {
	const [credentials, setCredentials] = useState<Credential[]>([]);
	const fetchCredentials = async () => {
		const response = await credentialApi.getAll();
		setCredentials(response.credentials);
	};
	useEffect(() => {
		fetchCredentials();
	}, dependencies);
	return { credentials };
};

export default useCredentials;
