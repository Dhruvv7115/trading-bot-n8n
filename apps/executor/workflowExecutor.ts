import { Workflow, Node, Edge, Execution } from "db/schemas";
import mongoose from "mongoose";

interface ExecutionContext {
	workflowId: string;
	executionId?: string;
	executionData: Map<string, any>;
}

/**
 * Execute a workflow
 */
export async function executeWorkflow(
	workflowId: string,
	triggerData?: any,
): Promise<any> {
	const session = await mongoose.startSession();
	session.startTransaction();

	const context: ExecutionContext = {
		workflowId,
		executionData: new Map(),
	};

	try {
		// 1. Load workflow, nodes, and edges
		const workflow = await Workflow.findById(workflowId);
		if (!workflow) {
			throw new Error("Workflow not found");
		}

		if (!workflow.active) {
			throw new Error("Workflow is not active");
		}

		const nodes = await Node.find({ workflowId }).lean();
		const edges = await Edge.find({ workflowId }).lean();

		// 2. Create execution record
		const execution = await Execution.create(
			[
				{
					workflowId,
					mode: triggerData ? "trigger" : "manual",
					status: "PENDING",
					data: {},
				},
			],
			{ session },
		);
		if (!execution) {
			throw new Error("Execution not found");
		}

		context.executionId = execution[0]?._id.toString();

		// 3. Build execution graph
		const graph = buildExecutionGraph(nodes, edges);

		// 4. Find trigger node (starting point)
		const triggerNode = nodes.find((n) => n.data?.kind === "TRIGGER");
		if (!triggerNode) {
			throw new Error("No trigger node found");
		}

		// 5. Execute nodes in order
		const result = await executeNode(
			triggerNode,
			graph,
			nodes,
			triggerData,
			context,
			session,
		);

		// 6. Update execution as successful
		await Execution.findByIdAndUpdate(
			context.executionId,
			{
				status: "success",
				stoppedAt: new Date(),
				data: Object.fromEntries(context.executionData),
			},
			{ session },
		);

		await session.commitTransaction();

		return {
			success: true,
			executionId: context.executionId,
			// result,
		};
	} catch (error: any) {
		await session.abortTransaction();

		// Update execution as failed
		if (context.executionId) {
			await Execution.findByIdAndUpdate(context.executionId, {
				status: "error",
				stoppedAt: new Date(),
				error: {
					message: error.message,
					stack: error.stack,
				},
			});
		}

		throw error;
	} finally {
		session.endSession();
	}
}

/**
 * Build a graph showing which nodes connect to which
 */
function buildExecutionGraph(
	nodes: any[],
	edges: any[],
): Map<string, string[]> {
	const graph = new Map<string, string[]>();

	// Initialize all nodes
	nodes.forEach((node) => {
		graph.set(node.id, []);
	});

	// Add edges
	edges.forEach((edge) => {
		const targets = graph.get(edge.source) || [];
		targets.push(edge.target);
		graph.set(edge.source, targets);
	});

	return graph;
}

/**
 * Execute a single node and its children recursively
 */
async function executeNode(
	node: any,
	graph: Map<string, string[]>,
	allNodes: any[],
	inputData: any,
	context: ExecutionContext,
	session: any,
): Promise<any> {
	console.log(`Executing node: ${node.title} (${node.id})`);

	let output;

	try {
		// Execute based on node kind
		if (node.data.kind === "TRIGGER") {
			// output = await executeTrigger(node, inputData);
		} else if (node.data.kind === "ACTION") {
			// output = await executeAction(node, inputData);
		} else {
			throw new Error(`Unknown node kind: ${node.data.kind}`);
		}

		// Store execution data
		context.executionData.set(node.id, {
			nodeId: node.id,
			title: node.title,
			status: "success",
			input: inputData,
			output,
			executedAt: new Date(),
		});

		// Get next nodes
		const nextNodeIds = graph.get(node.id) || [];

		// Execute next nodes sequentially
		if (nextNodeIds.length > 0) {
			for (const nextNodeId of nextNodeIds) {
				const nextNode = allNodes.find((n) => n.id === nextNodeId);
				if (nextNode) {
					output = await executeNode(
						nextNode,
						graph,
						allNodes,
						output, // Pass previous output as input
						context,
						session,
					);
				}
			}
		}

		return output;
	} catch (error: any) {
		// Store error
		context.executionData.set(node.id, {
			nodeId: node.id,
			title: node.title,
			status: "error",
			input: inputData,
			error: {
				message: error.message,
				stack: error.stack,
			},
			executedAt: new Date(),
		});

		throw error;
	}
}
