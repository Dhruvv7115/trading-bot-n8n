import {
	CreateEdgeSchemaBody,
	CreateEdgeSchemaParams,
	EdgeParamsSchema,
} from "common/types";
import { Edge, Workflow } from "db/schemas";
import type { Request, Response } from "express";
import { isValidObjectId } from "mongoose";

const createEdge = async (req: Request, res: Response) => {
	const body = CreateEdgeSchemaBody.safeParse(req.body);
	const params = CreateEdgeSchemaParams.safeParse(req.params);
	if (!body.success) {
		res.status(400).json({
			message: "Invalid node data.",
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
	const { workflowId } = params.data;
	if (!isValidObjectId(workflowId)) {
		res.status(400).json({
			message: "Invalid workflow id.",
		});
		return;
	}

	try {
		const workflow = await Workflow.findOne({ _id: workflowId });
		if (!workflow) {
			res.status(400).json({
				message: "Workflow not found!",
			});
			return;
		}
		if (workflow.userId?.toString() !== req.userId) {
			res.status(400).json({
				message:
					"You're unauthorised to create an edge on someone else's workflow.",
			});
			return;
		}
		const edge = await Edge.create({
			source: data.source,
			target: data.target,
			id: data.id,
			workflowId,
		});

		if (!edge) {
			res.status(500).json({
				message: "Something went wrong while creating the edge.",
			});
			return;
		}

		res.status(200).json({
			message: "Edge created successfully!!!",
			edge,
		});
		return;
	} catch (error) {
		console.log(error);
		res.status(500).json({
			message: "Something went bonkersss!!!",
		});
		return;
	}
};

const deleteEdge = async (req: Request, res: Response) => {
	const params = EdgeParamsSchema.safeParse(req.params);

	if (!params.success) {
		res.status(400).json({
			message: "Invalid parameters.",
			errors: params.error.message,
		});
		return;
	}

	const { workflowId, edgeId } = params.data;

	try {
		const workflow = await Workflow.findOne({
			_id: workflowId,
			userId: req.userId,
		});

		if (!workflow) {
			res.status(404).json({
				message: "Workflow not found or unauthorized.",
			});
			return;
		}

		const deletedEdge = await Edge.findOneAndDelete({
			id: edgeId,
			workflowId,
		});

		if (!deletedEdge) {
			res.status(404).json({
				message: "Edge not found.",
			});
			return;
		}

		res.status(200).json({
			message: "Edge deleted successfully!!!",
		});
	} catch (error) {
		console.log(error);
		res.status(500).json({
			message: "Something went wrong while deleting the edge.",
		});
	}
};

export { createEdge, deleteEdge };
