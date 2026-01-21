import { GetExecutionsSchemaParams } from "common/types";
import { Execution, Workflow } from "db/schemas";
import type { Request, Response } from "express";
import { executeWorkflow } from "executor/workflowExecutor";

const getAllExecutionsByWorkflowId = async (req: Request, res: Response) => {
	const { success, data } = GetExecutionsSchemaParams.safeParse(req.params);

	if (!success) {
		res.status(400).json({
			success: false,
			message: "Invalid workflow id",
		});
		return;
	}

	try {
		const workflow = await Workflow.findById(data.workflowId);
		if (!workflow) {
			res.status(404).json({
				success: false,
				message: "Workflow not found",
			});
			return;
		}
		if (workflow.userId?.toString() !== req.userId) {
			res.status(401).json({
				success: false,
				message: "Unauthorized",
			});
			return;
		}
		const executions = await Execution.find({ workflowId: data.workflowId });
		res.status(200).json({
			success: true,
			message: "Executions fetched successfully",
			executions,
		});
		return;
	} catch (error) {
		res.status(500).json({
			success: false,
			message: "Failed to fetch executions",
		});
		return;
	}
};

const executeWorkflowController = async (req: Request, res: Response) => {
	try {
		const { workflowId } = req.params;

		if (typeof workflowId !== "string") {
			return res.status(400).json({ message: "Invalid workflow id" });
		}
		// Verify ownership
		const workflow = await Workflow.findOne({
			_id: workflowId,
			userId: req.userId,
		});

		if (!workflow) {
			return res.status(404).json({ message: "Workflow not found" });
		}

		const result = await executeWorkflow(workflowId, req.body.triggerData);

		res.status(200).json({
			message: "Workflow executed successfully",
			...result,
		});
	} catch (error: any) {
		console.error(error);
		res.status(500).json({
			message: "Workflow execution failed",
			error: error.message,
		});
	}
};

export { getAllExecutionsByWorkflowId, executeWorkflowController };
