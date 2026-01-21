import { executePriceTrigger } from "./priceTrigger";
import { executeTimeTrigger } from "./timeTrigger";

export async function executeTrigger(
	node: any,
	triggerData?: any,
): Promise<any> {
	switch (node.type) {
		case "price":
			// return executePriceTrigger(node, triggerData);
		case "time":
			// return executeTimeTrigger(node, triggerData);
		default:
			throw new Error(`Unknown trigger type: ${node.type}`);
	}
}
