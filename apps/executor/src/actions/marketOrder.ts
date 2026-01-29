import { Credential } from "db/schemas";
import { decryptCredentialData } from "common/utils";
import { placeHyperliquidOrder } from "../orders/hyperliquid";
import { placeLighterOrder } from "../orders/lighter";
import { placeBackpackOrder } from "../orders/backpack";
import { fetchPrice } from "../utils/fetchPrice";
export async function executeMarketOrder(
	node: any,
	inputData: any,
): Promise<any> {
	console.log("Executing action:", node.title);

	const { symbol } = node.data.metaData;

	// Fetch and decrypt credentials
	if (!node.credentialId) {
		throw new Error("No credential specified for this node");
	}

	// Get credentials
	const credential = await Credential.findById(node.credentialId);
	if (!credential) {
		throw new Error("Credential not found");
	}

	// Decrypt the credential data
	const decryptedApikey = decryptCredentialData(credential.data.apiKey);
	const decryptedApiSecret = decryptCredentialData(credential.data.apiSecret);
	const decryptedData = {
		apiKey: decryptedApikey,
		apiSecret: decryptedApiSecret,
	};
	const price = await fetchPrice(symbol);

	// Execute order based on exchange
	const orderResult = await placeOrder(
		node.type,
		symbol,
		price,
		decryptedData, // { apiKey: "...", apiSecret: "..." }
	);

	return {
		type: "market_order",
		exchange: node.type,
		symbol,
		price,
		orderId: orderResult.orderId,
		executedPrice: orderResult.executedPrice,
		status: orderResult.status,
		timestamp: new Date(),
		inputData,
	};
}

async function placeOrder(
	exchange: string,
	symbol: string,
	price: number,
	credentials: any,
): Promise<any> {
	// Implement exchange-specific logic
	switch (exchange) {
		case "hyperliquid":
			return placeHyperliquidOrder(symbol, price, credentials);
		case "lighter":
			return placeLighterOrder(symbol, price, credentials);
		case "backpack":
			return placeBackpackOrder(symbol, price, credentials);
		default:
			throw new Error(`Unsupported exchange: ${exchange}`);
	}
}
