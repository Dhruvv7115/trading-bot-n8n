import type { TriggerType, TriggerMetaData } from "./triggers.types";
import { type TradingMetaData } from "./actions.types";
import { type ActionType } from "./actions.types";
export interface NodeType {
	id: string;
	position: { x: number; y: number };
	type: TriggerType | ActionType;
	title: string;
	description: string;
	data: {
		metaData: TriggerMetaData | TradingMetaData;
		kind: "TRIGGER" | "ACTION";
	};
	workflowId: string;
	credentialId?: string;
}

export interface Credential {
	id: string;
	name: string;
	type: "api_key" | "password" | "oauth";
	data: any;
}
