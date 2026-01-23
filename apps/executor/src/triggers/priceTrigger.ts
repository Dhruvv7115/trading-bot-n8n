import axios from "axios";

export async function executePriceTrigger(
	node: any,
	triggerData?: any,
): Promise<any> {
	console.log("Executing price trigger:", node.title);

	const { asset, price: targetPrice } = node.data.metaData;

	// If triggered externally (from price monitor), use that data
	if (triggerData) {
		return {
			asset,
			currentPrice: triggerData.price,
			targetPrice,
			triggered: true,
			timestamp: new Date(),
		};
	}

	// Otherwise, fetch current price and check condition
	const currentPrice = await fetchPrice(asset);

	const triggered = evaluateCondition(currentPrice, targetPrice);

	if (!triggered) {
		throw new Error(
			`Price condition not met, Current price: ${currentPrice}, Target price: ${targetPrice}`,
		);
	}

	return {
		asset,
		currentPrice,
		targetPrice,
		triggered: true,
		timestamp: new Date(),
	};
}

async function fetchPrice(asset: string): Promise<number> {
	// Example: Fetch from Binance
	console.log("Fetching price for asset:", asset);
	const response = await axios.get(
		`https://api.binance.com/api/v3/ticker/price?symbol=${asset}USDT`,
	);
	return parseFloat(response.data.price);
}

function evaluateCondition(currentPrice: number, targetPrice: number): boolean {
	return currentPrice <= targetPrice;
}
