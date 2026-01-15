import type { TriggerType, TriggerMetaData } from "./triggers.types";
import { type TradingMetaData } from "./actions.types";
import { type ActionType } from "./actions.types";
export interface NodeType {
	id: string;
	position: { x: number; y: number };
	type: TriggerType | ActionType;
	kind: "TRIGGER" | "ACTION";
	data: {
		metaData: TriggerMetaData | TradingMetaData;
		label: string;
	};
}
