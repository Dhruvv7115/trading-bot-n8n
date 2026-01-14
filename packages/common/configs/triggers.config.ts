export const TRIGGER_CONFIGS = {
	time: {
		id: "time",
		title: "Time Trigger",
		description: "Triggers every time a certain amount of time has passed.",
		defaultMetaData: {
			type: "time" as const,
			time: 60,
			asset: "SOL",
		},
	},
	price: {
		id: "price",
		title: "Price Trigger",
		description:
			"Triggers when the price of a certain asset reaches a certain value.",
		defaultMetaData: {
			type: "price" as const,
			price: 0,
			asset: "SOL",
		},
	},
  // in future
	// volume: {
	// 	id: "volume",
	// 	title: "Volume Trigger",
	// 	description: "Triggers when trading volume exceeds a threshold.",
	// 	defaultMetaData: {
	// 		type: "volume" as const,
	// 		volume: 1000000,
	// 		asset: "SOL",
	// 	},
	// },
} as const;

export const SUPPORTED_TRIGGERS = Object.values(TRIGGER_CONFIGS);
