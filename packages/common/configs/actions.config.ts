export const ACTION_CONFIGS = {
	hyperliquid: {
		id: "hyperliquid",
		title: "HyperLiquid",
		description: "Place a trade on hyperliquid",
	},
	lighter: {
		id: "lighter",
		title: "Lighter",
		description: "Place a trade on lighter",
	},
	// backpack: {
	// 	id: "backpack",
	// 	title: "Backpack",
	// 	description: "Place a trade on backpack",
	// },
} as const;

export const SUPPORTED_ACTIONS = Object.values(ACTION_CONFIGS);
