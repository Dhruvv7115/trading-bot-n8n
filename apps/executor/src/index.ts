import mongoose from "mongoose";
import {
	checkMissedExecutions,
	startPeriodicSync,
	startTimeScheduler,
	stopAllSchedules,
} from "./services/timeScheduler";
import { startPriceMonitor } from "./services/priceMonitor";

async function main() {
	// Connect to database
	await mongoose.connect(process.env.MONGO_URI!);
	console.log("📦 Connected to MongoDB");
	// Check for missed executions
	await checkMissedExecutions();
	// Start the scheduler
	await startTimeScheduler();
	// Start periodic sync
	startPeriodicSync();
	// Start price monitor
	startPriceMonitor();
	// Graceful shutdown
	process.on("SIGINT", async () => {
		console.log("\n🛑 Shutting down gracefully...");
		stopAllSchedules();
		await mongoose.disconnect();
		process.exit(0);
	});

	process.on("SIGTERM", async () => {
		console.log("\n🛑 Shutting down gracefully...");
		stopAllSchedules();
		await mongoose.disconnect();
		process.exit(0);
	});

	console.log("✅ Executor service started");
}

main().catch(console.error);
