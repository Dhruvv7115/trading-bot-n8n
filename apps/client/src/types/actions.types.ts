import type { AssetType } from "./asset.types";

export type ActionType = "hyperliquid" | "backpack" | "lighter";
export type TradingMetaData = {
	type: "LONG" | "SHORT";
	quantity: number;
	symbol: AssetType;
};
