import {
	CreateNodeSchemaBody,
	CreateNodeSchemaParams,
	DeleteNodeSchemaParams,
	GetNodeSchemaParams,
	UpdateNodeSchemaBody,
	UpdateNodeSchemaParams,
} from "common/types";
import { Credential, Edge, Node, Workflow } from "db/schemas";
import type { Request, Response } from "express";
import { isValidObjectId } from "mongoose";

const createNode = async (req: Request, res: Response) => {
	const body = CreateNodeSchemaBody.safeParse(req.body);
	const params = CreateNodeSchemaParams.safeParse(req.params);
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
					"You're unauthorised to create a node on someone else's workflow.",
			});
			return;
		}

		// If credentialId provided, verify it belongs to user
		if (data.credentialId) {
			const credential = await Credential.findOne({
				_id: data.credentialId,
				userId: req.userId,
			});

			if (!credential) {
				return res.status(404).json({
					message: "Credential not found or unauthorized.",
				});
			}

			// Verify credential type matches node type
			if (credential.type !== data.type) {
				return res.status(400).json({
					message: `Credential type '${credential.type}' doesn't match node type '${data.type}'`,
				});
			}
		}
		const node = await Node.create({
			id: data.id,
			title: data.title,
			description: data.description,
			type: data.type,
			data: {
				kind: data.data.kind,
				metaData: data.data.metaData,
			},
			position: {
				x: data.position.x,
				y: data.position.y,
			},
			credentialId: data?.credentialId,
			workflowId,
		});

		if (!node) {
			res.status(500).json({
				message: "Something went wrong while creating the node.",
			});
			return;
		}

		res.status(200).json({
			message: "Node created successfully!!!",
			node,
		});
		return;
	} catch (error: any) {
		console.error(error.message);
		res.status(500).json({
			message: "Something went bonkersss!!!",
			error: error.message,
		});
		return;
	}
};

const updateNode = async (req: Request, res: Response) => {
	const body = UpdateNodeSchemaBody.safeParse(req.body);
	const params = UpdateNodeSchemaParams.safeParse(req.params);

	if (!body.success) {
		res.status(400).json({
			message: "Invalid node data.",
			errors: body.error.message,
		});
		return;
	}

	if (!params.success) {
		res.status(400).json({
			message: "Invalid parameters.",
			errors: params.error.message,
		});
		return;
	}

	const { data } = body;
	const { workflowId, nodeId } = params.data;

	try {
		// Verify workflow ownership
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

		const updatedNode = await Node.findOneAndUpdate(
			{ id: nodeId, workflowId },
			{ $set: data },
			{ new: true },
		);

		if (!updatedNode) {
			res.status(404).json({
				message: "Node not found.",
			});
			return;
		}

		res.status(200).json({
			message: "Node updated successfully!!!",
			node: updatedNode,
		});
	} catch (error) {
		console.error(error);
		res.status(500).json({
			message: "Something went wrong while updating the node.",
		});
	}
};

const deleteNode = async (req: Request, res: Response) => {
	const params = DeleteNodeSchemaParams.safeParse(req.params);

	if (!params.success) {
		res.status(400).json({
			message: "Invalid parameters.",
			errors: params.error,
		});
		return;
	}

	const { workflowId, nodeId } = params.data;

	try {
		// Verify workflow ownership
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

		const deletedNode = await Node.findOneAndDelete({
			id: nodeId,
			workflowId,
		});

		if (!deletedNode) {
			res.status(404).json({
				message: "Node not found.",
			});
			return;
		}

		// Also delete edges connected to this node
		await Edge.deleteMany({
			workflowId,
			$or: [{ source: nodeId }, { target: nodeId }],
		});

		res.status(200).json({
			message: "Node deleted successfully!!!",
			node: deletedNode,
		});
		return;
	} catch (error) {
		console.error(error);
		res.status(500).json({
			message: "Something went wrong while deleting the node.",
		});
		return;
	}
};

const getAllNodes = async (req: Request, res: Response) => {
	const params = CreateNodeSchemaParams.safeParse(req.params);

	if (!params.success) {
		res.status(400).json({
			message: "Invalid workflow id.",
			errors: params.error.message,
		});
		return;
	}

	const { workflowId } = params.data;

	try {
		// Verify workflow ownership
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

		const nodes = await Node.find({ workflowId }).lean();

		res.status(200).json({
			message: "Nodes fetched successfully!!!",
			nodes,
			count: nodes.length,
		});
	} catch (error) {
		console.error(error);
		res.status(500).json({
			message: "Something went wrong while fetching nodes.",
		});
	}
};

const getNodeById = async (req: Request, res: Response) => {
	const params = GetNodeSchemaParams.safeParse(req.params);

	if (!params.success) {
		res.status(400).json({
			message: "Invalid parameters.",
			errors: params.error.message,
		});
		return;
	}

	const { workflowId, nodeId } = params.data;

	try {
		// Verify workflow ownership
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

		const node = await Node.findOne({
			id: nodeId,
			workflowId,
		}).lean();

		if (!node) {
			res.status(404).json({
				message: "Node not found.",
			});
			return;
		}

		res.status(200).json({
			message: "Node fetched successfully!!!",
			node,
		});
	} catch (error) {
		console.error(error);
		res.status(500).json({
			message: "Something went wrong while fetching the node.",
		});
	}
};

export { createNode, getAllNodes, updateNode, getNodeById, deleteNode };
