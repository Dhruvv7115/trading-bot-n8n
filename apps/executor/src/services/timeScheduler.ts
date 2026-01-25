import { Workflow, Node, Execution } from "db/schemas";
import { executeWorkflow } from "../workflowExecutor";

interface ScheduledJob {
	workflowId: string;
	nodeId: string;
	intervalMs: number;
	timerId: NodeJS.Timeout;
	nextRun: Date;
}

// Store active timers
const activeJobs = new Map<string, ScheduledJob>();

/**
 * Start the time scheduler
 */
export async function startTimeScheduler() {
	console.log("🕐 Starting time scheduler...");

	// Load all active workflows with time triggers
	const activeWorkflows = await Workflow.find({ active: true }).lean();

	for (const workflow of activeWorkflows) {
		const timeNodes = await Node.find({
			workflowId: workflow._id,
			type: "time",
			"data.kind": "TRIGGER",
		}).lean();

		for (const node of timeNodes) {
			scheduleWorkflow(workflow._id.toString(), node);
		}
	}

	console.log(`✅ Scheduled ${activeJobs.size} workflows`);
}

/**
 * Schedule a workflow to run at intervals
 */
export function scheduleWorkflow(workflowId: string, node: any) {
	const jobKey = `${workflowId}-${node.id}`;

	// If already scheduled, skip
	if (activeJobs.has(jobKey)) {
		console.log(`⏭️  Workflow ${workflowId} already scheduled`);
		return;
	}

	const { time, unit = "seconds" } = node.data.metaData;

	if (!time) {
		console.error(`❌ No interval specified for node ${node.id}`);
		return;
	}

	// Convert to milliseconds
	const intervalMs = convertToMilliseconds(time, unit);

	console.log(`⏰ Scheduling workflow ${workflowId} every ${time} ${unit}`);

	// Create the timer
	const timerId = setInterval(async () => {
		console.log(`🔔 Triggering workflow ${workflowId} (${node.title})`);

		try {
			await executeWorkflow(workflowId, {
				triggeredBy: "timer",
				nodeId: node.id,
				timestamp: new Date(),
			});
		} catch (error) {
			console.error(`❌ Error executing workflow ${workflowId}:`, error);
		}
	}, intervalMs);

	// Store the job
	activeJobs.set(jobKey, {
		workflowId,
		nodeId: node.id,
		intervalMs,
		timerId,
		nextRun: new Date(Date.now() + intervalMs),
	});
}

/**
 * Stop a scheduled workflow
 */
export function unscheduleWorkflow(workflowId: string, nodeId: string) {
	const jobKey = `${workflowId}-${nodeId}`;
	const job = activeJobs.get(jobKey);

	if (job) {
		clearInterval(job.timerId);
		activeJobs.delete(jobKey);
		console.log(`🛑 Unscheduled workflow ${workflowId}`);
	}
}

/**
 * Stop all scheduled workflows
 */
export function stopAllSchedules() {
	console.log("🛑 Stopping all scheduled workflows...");

	activeJobs.forEach((job, key) => {
		clearInterval(job.timerId);
	});

	activeJobs.clear();
	console.log("✅ All schedules stopped");
}

/**
 * Get all active schedules
 */
export function getActiveSchedules() {
	return Array.from(activeJobs.values()).map((job) => ({
		workflowId: job.workflowId,
		nodeId: job.nodeId,
		intervalMs: job.intervalMs,
		nextRun: job.nextRun,
	}));
}

/**
 * Convert interval to milliseconds
 */
export function convertToMilliseconds(interval: number, unit: string): number {
	switch (unit) {
		case "seconds":
			return interval * 1000;
		case "minutes":
			return interval * 60 * 1000;
		case "hours":
			return interval * 60 * 60 * 1000;
		case "days":
			return interval * 24 * 60 * 60 * 1000;
		default:
			throw new Error(`Unknown time unit: ${unit}`);
	}
}

/**
 * Reschedule a workflow (used when workflow is updated)
 */
export async function rescheduleWorkflow(workflowId: string) {
	// Remove existing schedules for this workflow
	const jobsToRemove = Array.from(activeJobs.keys()).filter((key) =>
		key.startsWith(workflowId),
	);

	jobsToRemove.forEach((key) => {
		const job = activeJobs.get(key);
		if (job) {
			clearInterval(job.timerId);
			activeJobs.delete(key);
		}
	});

	// Reload and reschedule
	const workflow = await Workflow.findById(workflowId);
	if (!workflow || !workflow.active) {
		return;
	}

	const timeNodes = await Node.find({
		workflowId,
		type: "time",
		"data.kind": "TRIGGER",
	}).lean();

	for (const node of timeNodes) {
		scheduleWorkflow(workflowId, node);
	}
}

// Check on startup if any executions were missed
export async function checkMissedExecutions() {
	const activeWorkflows = await Workflow.find({ active: true }).lean();

	for (const workflow of activeWorkflows) {
		const lastExecution = await Execution.findOne({
			workflowId: workflow._id,
		})
			.sort({ startedAt: -1 })
			.lean();

		const timeNodes = await Node.find({
			workflowId: workflow._id,
			type: "time",
			"data.kind": "TRIGGER",
		}).lean();

		for (const node of timeNodes) {
			const { time, unit = "seconds" } = node?.data?.metaData;
			const intervalMs = convertToMilliseconds(time, unit);

			if (lastExecution) {
				const timeSinceLastRun = Date.now() - lastExecution.createdAt.getTime();

				// If we missed an execution, run it now
				if (timeSinceLastRun > intervalMs) {
					console.log(
						`⚠️  Missed execution for workflow ${workflow._id}, running now...`,
					);
					await executeWorkflow(workflow._id.toString(), {
						triggeredBy: "timer",
						missed: true,
						timestamp: new Date(),
					});
				}
			}
		}
	}
}

let lastSyncTime = new Date();

/** 
 * Periodically sync schedules from database
 */
export async function syncSchedulesFromDB() {
	console.log("🔄 Syncing schedules from database...");

	try {
		// Get all active workflows
		const activeWorkflows = await Workflow.find({
			active: true,
			updatedAt: { $gte: lastSyncTime }, // Only changed workflows
		}).lean();

		// Get all inactive workflows that might need unscheduling
		const inactiveWorkflows = await Workflow.find({
			active: false,
			updatedAt: { $gte: lastSyncTime },
		}).lean();

		// Unschedule inactive workflows
		for (const workflow of inactiveWorkflows) {
			unscheduleAllForWorkflow(workflow._id.toString());
		}

		// Schedule/reschedule active workflows
		for (const workflow of activeWorkflows) {
			await rescheduleWorkflow(workflow._id.toString());
		}

		lastSyncTime = new Date();
		console.log(`✅ Synced ${activeWorkflows.length} workflows`);
	} catch (error) {
		console.error("❌ Error syncing schedules:", error);
	}
}

/**
 * Unschedule all jobs for a workflow
 */
function unscheduleAllForWorkflow(workflowId: string) {
	const jobsToRemove = Array.from(activeJobs.keys()).filter((key) =>
		key.startsWith(workflowId),
	);

	jobsToRemove.forEach((key) => {
		const job = activeJobs.get(key);
		if (job) {
			clearInterval(job.timerId);
			activeJobs.delete(key);
		}
	});
}

/**
 * Start periodic sync
 */
export function startPeriodicSync() {
	// Sync every 30 seconds
	setInterval(async () => {
		await syncSchedulesFromDB();
	}, 30000);

	console.log("🔄 Started periodic database sync");
}
