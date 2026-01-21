import axios from "axios";

export async function executePriceTrigger(
	node: any,
	triggerData?: any,
): Promise<any> {
	console.log("Executing price trigger:", node.title);

	const { symbol, condition, targetPrice, exchange } = node.data.metaData;

	// If triggered externally (from price monitor), use that data
	if (triggerData) {
		return {
			symbol,
			currentPrice: triggerData.price,
			targetPrice,
			condition,
			triggered: true,
			timestamp: new Date(),
		};
	}

	// Otherwise, fetch current price and check condition
	const currentPrice = await fetchPrice(symbol, exchange);

	const triggered = evaluateCondition(currentPrice, condition, targetPrice);

	if (!triggered) {
		throw new Error(
			`Price condition not met: ${currentPrice} ${condition} ${targetPrice}`,
		);
	}

	return {
		symbol,
		currentPrice,
		targetPrice,
		condition,
		triggered: true,
		timestamp: new Date(),
	};
}

async function fetchPrice(symbol: string, exchange: string): Promise<number> {
	// Example: Fetch from Binance
	if (exchange === "binance") {
		const response = await axios.get(
			`https://api.binance.com/api/v3/ticker/price?symbol=${symbol}`,
		);
		return parseFloat(response.data.price);
	}

	// Add other exchanges...
	throw new Error(`Unsupported exchange: ${exchange}`);
}

function evaluateCondition(
	currentPrice: number,
	condition: string,
	targetPrice: number,
): boolean {
	switch (condition) {
		case ">=":
			return currentPrice >= targetPrice;
		case "<=":
			return currentPrice <= targetPrice;
		case ">":
			return currentPrice > targetPrice;
		case "<":
			return currentPrice < targetPrice;
		case "==":
			return Math.abs(currentPrice - targetPrice) < 0.01; // Small tolerance
		default:
			throw new Error(`Unknown condition: ${condition}`);
	}
}
