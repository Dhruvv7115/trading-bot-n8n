export type TimeNodeMetaData = {
	type: "time";
	time: number;
	asset: string;
};

export type PriceNodeMetaData = {
	type: "price";
	price: number;
	asset: string;
};

// in future
// type VolumeNodeMetaData = {
// 	type: "volume";
// 	volume: number;
// 	asset: string;
// };

export type TriggerMetaData =
	| TimeNodeMetaData
	| PriceNodeMetaData;
export type TriggerType = TriggerMetaData["type"]; // Automatically extracts "time" | "price" | "volume"
