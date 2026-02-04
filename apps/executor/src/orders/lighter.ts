import { NonceManagerType } from "./lighter-sdk-ts/nonce_manager";
import { SignerClient } from "./lighter-sdk-ts/signer";

const BASE_URL =
	process.env.LIGHTER_BASE_URL || "https://mainnet.zklighter.elliot.ai";

export const MARKETS: Record<string, { marketId: number; qtyDecimal: number }> =
	{
		BTC: {
			marketId: 1,
			qtyDecimal: 100000,
		},
		ETH: {
			marketId: 0,
			qtyDecimal: 10000,
		},
		SOL: {
			marketId: 2,
			qtyDecimal: 1000,
		},
	};

export async function placeLighterOrder({
	symbol,
	price,
	credentials,
	type,
	quantity,
}: {
	symbol: "BTC" | "ETH" | "SOL";
	price: number;
	credentials: any;
	type: "LONG" | "SHORT";
	quantity: number;
}): Promise<any> {
	// TODO: Implement actual Lighter API call
	console.log("Placing Lighter order:", { symbol, price });

	const API_KEY_PRIVATE_KEY = credentials.privateKey;
	const ACCOUNT_INDEX = credentials.accountIndex;
	const API_KEY_INDEX = credentials.apiKeyIndex;

	const marketIndex = MARKETS[symbol]?.marketId;
	const qtyDecimal = MARKETS[symbol]?.qtyDecimal;
	if (!marketIndex || !qtyDecimal) {
		throw new Error("Invalid market");
	}

	const client = await SignerClient.create({
		url: BASE_URL,
		privateKey: API_KEY_PRIVATE_KEY,
		apiKeyIndex: API_KEY_INDEX,
		accountIndex: ACCOUNT_INDEX,
		nonceManagementType: NonceManagerType.OPTIMISTIC,
	});

	const isAsk = type === "SHORT";
	const baseAmount = Math.round(quantity * qtyDecimal);

	const order = await client.createOrder({
		marketIndex,
		clientOrderIndex: 0,
		baseAmount,
		price,
		isAsk,
		orderType: SignerClient.ORDER_TYPE_LIMIT,
		timeInForce: SignerClient.ORDER_TIME_IN_FORCE_GOOD_TILL_TIME,
		reduceOnly: 0,
		triggerPrice: SignerClient.NIL_TRIGGER_PRICE,
		orderExpiry: SignerClient.DEFAULT_28_DAY_ORDER_EXPIRY,
	});

	return order;
}
