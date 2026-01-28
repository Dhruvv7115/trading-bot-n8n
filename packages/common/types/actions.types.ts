import type { AssetType } from "./assets.types";

export type ActionType = "hyperliquid" | "backpack" | "lighter";
export type TradingMetaData = {
	type: "LONG" | "SHORT";
	quantity: number;
	symbol: AssetType;
	credentialId: string;
};
