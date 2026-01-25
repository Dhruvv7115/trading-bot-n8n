import mongoose from "mongoose";
import {
	checkMissedExecutions,
	startPeriodicSync,
	startTimeScheduler,
	stopAllSchedules,
} from "./services/timeScheduler";

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
