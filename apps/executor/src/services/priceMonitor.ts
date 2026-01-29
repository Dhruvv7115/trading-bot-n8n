// apps/executor/src/services/priceMonitor.ts
import { Workflow, Node } from "db/schemas";
import { executeWorkflow } from "../workflowExecutor";
import axios from "axios";
import { evaluateCondition } from "../utils/checkPriceCondition";
import { fetchPrice as fetchPriceFromBinance } from "../utils/fetchPrice";

interface PriceCache {
	price: number;
	timestamp: number;
}

interface PriceTrigger {
	workflowId: string;
	nodeId: string;
	symbol: string;
	exchange: string;
	targetPrice: number;
	lastPrice?: number; // For cross detection
}

// Cache prices to avoid excessive API calls
const priceCache = new Map<string, PriceCache>();
const activeTriggers = new Map<string, PriceTrigger>();

// How often to check prices (in milliseconds)
const CHECK_INTERVAL = 10000; // 10 seconds
const CACHE_DURATION = 5000; // 5 seconds

/**
 * Start the price monitor service
 */
export async function startPriceMonitor() {
	console.log("💰 Starting price monitor service...");

	// Load all active price triggers
	await loadPriceTriggers();

	// Check prices at regular intervals
	setInterval(async () => {
		await checkAllPrices();
	}, CHECK_INTERVAL);

	console.log(
		`✅ Price monitor started (checking every ${CHECK_INTERVAL / 1000}s)`,
	);
}

/**
 * Load all price triggers from active workflows
 */
export async function loadPriceTriggers() {
	try {
		// Find all active workflows
		const activeWorkflows = await Workflow.find({ active: true }).lean();

		for (const workflow of activeWorkflows) {
			// Find price trigger nodes
			const priceNodes = await Node.find({
				workflowId: workflow._id,
				type: "price",
				"data.kind": "TRIGGER",
			}).lean();

			for (const node of priceNodes) {
				registerPriceTrigger(workflow._id.toString(), node);
			}
		}

		console.log(`📊 Loaded ${activeTriggers.size} price triggers`);
	} catch (error) {
		console.error("❌ Error loading price triggers:", error);
	}
}

/**
 * Register a single price trigger
 */
export function registerPriceTrigger(workflowId: string, node: any) {
	const triggerKey = `${workflowId}-${node.id}`;

	const { asset: symbol, price: targetPrice } = node.data.metaData;

	if (!symbol || !targetPrice) {
		console.error(`❌ Invalid price trigger config for node ${node.id}`);
		return;
	}

	activeTriggers.set(triggerKey, {
		workflowId,
		nodeId: node.id,
		symbol: symbol.toUpperCase(),
		exchange: "binance",
		targetPrice: parseFloat(targetPrice),
	});

	console.log(
		`✅ Registered price trigger: ${symbol} ${targetPrice} on binance`,
	);
}

/**
 * Unregister a price trigger
 */
export function unregisterPriceTrigger(workflowId: string, nodeId: string) {
	const triggerKey = `${workflowId}-${nodeId}`;
	activeTriggers.delete(triggerKey);
	console.log(`🗑️  Unregistered price trigger: ${triggerKey}`);
}

/**
 * Unregister all triggers for a workflow
 */
export function unregisterAllTriggersForWorkflow(workflowId: string) {
	const keysToRemove = Array.from(activeTriggers.keys()).filter((key) =>
		key.startsWith(workflowId),
	);

	keysToRemove.forEach((key) => activeTriggers.delete(key));
	console.log(
		`🗑️  Unregistered ${keysToRemove.length} triggers for workflow ${workflowId}`,
	);
}

/**
 * Check all registered price triggers
 */
async function checkAllPrices() {
	console.log("checking prices");
	if (activeTriggers.size === 0) {
		console.log("active triggers size is 0");
		return;
	}

	// Group triggers by exchange and symbol to batch API calls
	const symbolsByExchange = new Map<string, Set<string>>();

	activeTriggers.forEach((trigger) => {
		const key = trigger.exchange;
		if (!symbolsByExchange.has(key)) {
			symbolsByExchange.set(key, new Set());
		}
		symbolsByExchange.get(key)!.add(trigger.symbol);
	});

	// Fetch prices for each exchange
	for (const [exchange, symbols] of symbolsByExchange) {
		for (const symbol of symbols) {
			try {
				const currentPrice = await fetchPrice(symbol, exchange);
				console.log("current price of " + symbol + " is " + currentPrice);

				// Check all triggers for this symbol
				activeTriggers.forEach(async (trigger, key) => {
					if (trigger.symbol === symbol) {
						const triggered = evaluateCondition(
							currentPrice,
							trigger.targetPrice,
						);

						if (triggered) {
							console.log(
								`🔔 Price trigger activated: ${symbol} (target Price: ${trigger.targetPrice}) (current: ${currentPrice})`,
							);

							// Execute workflow
							try {
								await executeWorkflow(trigger.workflowId, {
									triggeredBy: "price",
									nodeId: trigger.nodeId,
									symbol: trigger.symbol,
									currentPrice,
									targetPrice: trigger.targetPrice,
									timestamp: new Date(),
								});

								// ✅ 1. Remove from memory (immediate effect)
								activeTriggers.delete(key);

								// ✅ 2. Deactivate in database (persists across restarts)
								await Workflow.findByIdAndUpdate(trigger.workflowId, {
									active: false,
									lastExecutedAt: new Date(),
								});

								console.log(
									`✅ Workflow ${trigger.workflowId} executed and deactivated`,
								);
							} catch (error) {
								console.error(
									`❌ Error executing workflow ${trigger.workflowId}:`,
									error,
								);
							}
						}

						// Update last price for cross detection
						trigger.lastPrice = currentPrice;
					}
				});
			} catch (error) {
				console.error(
					`❌ Error fetching price for ${symbol} on ${exchange}:`,
					error,
				);
			}
		}
	}
}

/**
 * Fetch current price from exchange
 */
async function fetchPrice(symbol: string, exchange: string = "binance"): Promise<number> {
	const cacheKey = `${exchange}:${symbol}`;
	const cached = priceCache.get(cacheKey);

	// Return cached price if still valid
	if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
		return cached.price;
	}

	const price = await fetchPriceFromBinance(symbol);

	// Cache the price
	priceCache.set(cacheKey, {
		price,
		timestamp: Date.now(),
	});

	return price;
}

/**
 * Reload triggers for a specific workflow
 */
// export async function reloadTriggersForWorkflow(workflowId: string) {
// 	// Remove existing triggers
// 	unregisterAllTriggersForWorkflow(workflowId);

// 	// Load workflow
// 	const workflow = await Workflow.findById(workflowId);
// 	if (!workflow || !workflow.active) {
// 		return;
// 	}

// 	// Load price triggers
// 	const priceNodes = await Node.find({
// 		workflowId,
// 		type: "price",
// 		"data.kind": "TRIGGER",
// 	}).lean();

// 	for (const node of priceNodes) {
// 		registerPriceTrigger(workflowId, node);
// 	}
// }

/**
 * Get all active triggers (for debugging/monitoring)
 */
// export function getActiveTriggers() {
// 	return Array.from(activeTriggers.entries()).map(([key, trigger]) => ({
// 		key,
// 		...trigger,
// 	}));
// }
