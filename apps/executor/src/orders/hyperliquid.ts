import { Hyperliquid } from "hyperliquid";

export async function placeHyperliquidOrder({
	symbol,
	price,
	credentials,
	type,
	quantity,
}: {
	symbol: string;
	price: number;
	credentials: any;
	type: "LONG" | "SHORT";
	quantity: number;
}): Promise<any> {
	console.log("Placing Hyperliquid order:", { symbol, price, type, quantity });
	console.log("credentials", credentials);

	const sdk = new Hyperliquid({
		enableWs: false,
		privateKey: credentials.apiKey,
		testnet: false,
		walletAddress: credentials.walletAddress,
	});

	const isAsk = type === "SHORT";

	try {
		// Place an order and AWAIT the result
		const placeOrderResult = await sdk.exchange.placeOrder({
			coin: symbol,
			is_buy: !isAsk,
			sz: quantity,
			limit_px: price,
			order_type: { limit: { tif: "Gtc" } },
			reduce_only: false,
		});

		console.log("Order placed successfully:", placeOrderResult);

		// Return actual order result
		return {
			orderId:
				placeOrderResult.response?.data?.statuses?.[0]?.resting?.oid ||
				`HL-${Date.now()}`,
			executedPrice: price,
			status: placeOrderResult.response?.data?.statuses?.[0]?.filled
				? "filled"
				: "pending",
			rawResponse: placeOrderResult,
		};
	} catch (error) {
		console.error("Error placing Hyperliquid order:", error);
		// Re-throw the error so the caller knows the order failed
		throw new Error(
			`Failed to place Hyperliquid order: ${error instanceof Error ? error.message : String(error)}`,
		);
	}
}
