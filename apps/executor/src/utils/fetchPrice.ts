import axios from "axios";
export async function fetchPrice(asset: string): Promise<number> {
	// Example: Fetch from Binance
	console.log("Fetching price for asset:", asset);
	const response = await axios.get(
		`https://api.binance.com/api/v3/ticker/price?symbol=${asset}USDT`,
	);
	return parseFloat(response.data.price);
}

