import { executePriceTrigger } from "./priceTrigger";
import { executeTimeTrigger } from "./timeTrigger";

export async function executeTrigger(
	node: any,
	triggerData?: any,
): Promise<any> {
	switch (node.type) {
		case "price":
<<<<<<< HEAD
			// return executePriceTrigger(node, triggerData);
		case "time":
			// return executeTimeTrigger(node, triggerData);
=======
			return executePriceTrigger(node, triggerData);
		case "time":
			return executeTimeTrigger(node, triggerData);
>>>>>>> 78f8c61e80720f29a1e7b0493726c2cf07794b34
		default:
			throw new Error(`Unknown trigger type: ${node.type}`);
	}
}
