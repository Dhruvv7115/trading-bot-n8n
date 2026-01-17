import { GetExecutionsSchemaParams } from "common/types";
import { Execution, Workflow } from "db/schemas";
import type { Request, Response } from "express";

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
			data: executions,
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

export { getAllExecutionsByWorkflowId };
