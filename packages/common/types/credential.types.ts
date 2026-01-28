export interface Credential {
	_id: string;
	name: string;
	description: string;
	data: any;
	createdAt: string;
	updatedAt: string;
}

export interface CredentialResponse {
	credentials: Credential[];
}

export interface CredentialRequest {
	name: string;
	description: string;
	data: any;
}

export interface CredentialUpdate {
	name?: string;
	description?: string;
	data?: any;
}

export interface CredentialDelete {
	id: string;
}