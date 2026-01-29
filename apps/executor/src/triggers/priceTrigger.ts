import { evaluateCondition } from "../utils/checkPriceCondition";
import { fetchPrice } from "../utils/fetchPrice";

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
	console.log("Price condition met, executing actions - ", node.title);

	return {
		asset,
		currentPrice,
		targetPrice,
		triggered: true,
		timestamp: new Date(),
	};
}

