import { executeMarketOrder } from "./marketOrder";
<<<<<<< HEAD
=======
import { executeLimitOrder } from "./limitOrder";
>>>>>>> 78f8c61e80720f29a1e7b0493726c2cf07794b34
import { executeNotification } from "./notification";

export async function executeAction(node: any, inputData: any): Promise<any> {
	switch (node.type) {
		case "hyperliquid":
		case "lighter":
		case "backpack":
<<<<<<< HEAD
			// return executeMarketOrder(node, inputData);
=======
			return executeMarketOrder(node, inputData);
		case "limit_order":
			return executeLimitOrder(node, inputData);
>>>>>>> 78f8c61e80720f29a1e7b0493726c2cf07794b34
		case "notification":
			return executeNotification(node, inputData);
		default:
			throw new Error(`Unknown action type: ${node.type}`);
	}
}
