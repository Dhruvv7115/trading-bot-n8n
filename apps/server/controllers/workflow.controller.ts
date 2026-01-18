import {
	CreateWorkflowSchema,
	DeleteWorkflowSchemaParams,
	GetWorkflowByIdSchema,
	UpdateWorkflowSchemaBody,
	UpdateWorkflowSchemaParams,
} from "common/types";
import { Edge, Node, Workflow } from "db/schemas";
import type { Request, Response } from "express";

const createWorkflowController = async (req: Request, res: Response) => {
	const userId = req.userId!;
	const { success, data } = CreateWorkflowSchema.safeParse(req.body);
	if (!success) {
		res.status(400).json({
			message: "Invalid request.",
		});
		return;
	}
	try {
		const newWorkflow = await Workflow.create({
			name: data.name,
			description: data.description,
			tags: data.tags,
			active: data.active,
			userId,
		});

		if (!newWorkflow) {
			res.status(500).json({
				message: "Something went bonkersss!!!",
			});
			return;
		}

		res.status(200).json({
			message: "Workflow created successfully!!!",
			workflow: newWorkflow,
		});
		return;
	} catch (error: any) {
		console.error(error.message);
		res.status(500).json({
			message: "Something went bonkersss!!!",
		});
		return;
	}
};

const updateWorkflowController = async (req: Request, res: Response) => {
	const body = UpdateWorkflowSchemaBody.safeParse(req.body);
	const params = UpdateWorkflowSchemaParams.safeParse(req.params);

	if (!body.success) {
		res.status(400).json({
			message: "Invalid request.",
		});
		return;
	}
	const { data } = body;
	if (!params.success) {
		res.status(400).json({
			message: "Invalid workflow id.",
		});
		return;
	}
	const workflowId = params.data.id;

	try {
		const workflow = await Workflow.findOne({
			_id: workflowId,
		});

		if (!workflow) {
			res.status(400).json({
				message: "Workflow not found.",
			});
			return;
		}

		if (workflow.userId?.toString() !== req.userId) {
			res.status(400).json({
				message: "You are not authorised to update someone else's workflow.",
			});
			return;
		}

		const updatedWorkflow = await Workflow.findOneAndUpdate(
			{
				_id: workflowId,
			},
			{
				name: data?.name,
				description: data?.description,
				tags: data?.tags,
				active: data?.active,
			},
			{
				new: true,
			},
		);

		if (!updatedWorkflow) {
			res.status(400).json({
				message: "Something went wrong while updating the workflow.",
			});
			return;
		}

		res.status(200).json({
			message: "Workflow updated successfully!!!",
			workflow: updatedWorkflow,
		});
		return;
	} catch (error) {
		console.error(error);
		res.status(500).json({
			message: "Something went bonkersss!!!",
		});
		return;
	}
};

const getAllWorkflowsController = async (req: Request, res: Response) => {
	const userId = req.userId!;
	try {
		const workflows = await Workflow.find({ userId });
		if (!workflows) {
			res.status(400).json({
				message: "No workflows found.",
			});
			return;
		}
		res.status(200).json({
			message: "Workflows found successfully!!!",
			workflows,
		});
		return;
	} catch (error) {
		res.status(500).json({
			message: "Something went bonkersss!!!",
		});
		return;
	}
};

const getWorkflowByIdController = async (req: Request, res: Response) => {
	const userId = req.userId;
	const { success, data } = GetWorkflowByIdSchema.safeParse(req.params);
	if (!success) {
		res.status(400).json({
			message: "Invalid workflow id.",
		});
		return;
	}

	try {
		const workflow = await Workflow.findOne({ _id: data.id }).lean();
		if (!workflow) {
			res.status(400).json({
				message: "Workflow not found.",
			});
			return;
		}

		const nodes = await Node.find({ workflowId: workflow._id }).lean();
		const edges = await Edge.find({ workflowId: workflow._id }).lean();

		if (workflow.userId?.toString() !== userId) {
			res.status(400).json({
				message: "You are unauthorised to view someone else's workflows",
			});
			return;
		}

		res.status(200).json({
			message: "Workflow found successfully!!!",
			workflow: { ...workflow, nodes, edges },
		});
		return;
	} catch (error) {
		console.error(error);
		res.status(500).json({
			message: "Something went bonkersss!!!",
		});
		return;
	}
};

const deleteWorkflowController = async (req: Request, res: Response) => {
	const { success, data } = DeleteWorkflowSchemaParams.safeParse(req.params);
	if (!success) {
		res.status(400).json({
			message: "Invalid workflow id.",
		});
		return;
	}
	try {
		const workflow = await Workflow.findOne({ _id: data.id });
		if (!workflow) {
			res.status(400).json({
				message: "Workflow not found.",
			});
			return;
		}

		if (workflow.userId?.toString() !== req.userId) {
			res.status(400).json({
				message: "You are not authorised to delete someone else's workflow.",
			});
			return;
		}

		await Workflow.deleteOne({ _id: data.id });
		await Node.deleteMany({ workflowId: workflow._id });
		await Edge.deleteMany({ workflowId: workflow._id });

		res.status(200).json({
			message: "Workflow deleted successfully!!!",
		});
		return;
	} catch (error) {
		console.error(error);
		res.status(400).json({
			message: "Something went bonkersss!!!",
		});
		return;
	}
};

export {
	createWorkflowController,
	updateWorkflowController,
	deleteWorkflowController,
	getAllWorkflowsController,
	getWorkflowByIdController,
};
