import axios from "axios";
export async function fetchPrice(symbol: string): Promise<number> {
	try {
		const response = await axios.get(
			`https://api.binance.com/api/v3/ticker/price?symbol=${symbol}USDT`,
			{ timeout: 5000 },
		);
		return parseFloat(response.data.price);
	} catch (error) {
		throw new Error(`Failed to fetch Binance price for ${symbol}`);
	}
}
