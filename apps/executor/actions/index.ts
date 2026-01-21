import { executeMarketOrder } from "./marketOrder";
import { executeNotification } from "./notification";

export async function executeAction(node: any, inputData: any): Promise<any> {
	switch (node.type) {
		case "hyperliquid":
		case "lighter":
		case "backpack":
			// return executeMarketOrder(node, inputData);
		case "notification":
			return executeNotification(node, inputData);
		default:
			throw new Error(`Unknown action type: ${node.type}`);
	}
}
