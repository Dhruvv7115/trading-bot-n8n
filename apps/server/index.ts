import express from "express";
import mongoose, { isValidObjectId } from "mongoose";
import {
	CreateEdgeSchemaBody,
	CreateEdgeSchemaParams,
	CreateNodeSchemaBody,
	CreateNodeSchemaParams,
	CreateWorkflowSchema,
	DeleteWorkflowSchemaParams,
	EdgeParamsSchema,
	GetNodeSchemaParams,
	GetWorkflowByIdSchema,
	SigninSchema,
	SignupSchema,
	UpdateNodeSchemaBody,
	UpdateNodeSchemaParams,
	UpdateWorkflowSchemaBody,
	UpdateWorkflowSchemaParams,
} from "common/types";
import { Edge, Node, User, Workflow } from "db/schemas";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { authMiddleware } from "./middleware";
const app = express();

const PORT = process.env.PORT!;
const JWT_SECRET = process.env.JWT_SECRET!;

app.use(express.json());
app.use(
	express.urlencoded({
		extended: true,
	}),
);

mongoose.connect(process.env.MONGO_URI!).then(() => {
	app.listen(PORT);
});

//routes

// auth routes
app.post("/signup", async (req, res) => {
	const { success, data } = SignupSchema.safeParse(req.body);
	if (!success) {
		res.status(403).json({
			message: "Incorrect inputs",
		});
		return;
	}
	const existingUser = await User.findOne({ username: data.username });

	if (existingUser) {
		res.status(400).json({
			message: "User with this username already exists try another one.",
		});
	}
	const SALT_ROUNDS = 10;

	const hashedPassword = await bcrypt.hash(data.password, SALT_ROUNDS);

	try {
		const newUser = await User.create({
			username: data.username,
			password: hashedPassword,
		});

		res.status(200).json({
			message: "Signed up successfully.",
			id: newUser._id,
		});
	} catch (error: any) {
		console.log(error.message);

		res.status(500).json({
			message: "Error while creating a new user.",
		});
		return;
	}
});

app.post("/signin", async (req, res) => {
	const { success, data } = SigninSchema.safeParse(req.body);
	if (!success) {
		res.status(403).json({
			message: "Incorrect inputs",
		});
		return;
	}
	try {
		const user = await User.findOne({
			username: data.username,
		});
		if (!user) {
			res.status(400).json({
				message: "User with this username doesn't exist",
			});
			return;
		}

		const comparePassword = bcrypt.compare(data.password, user.password);
		if (!comparePassword) {
			res.status(400).json({
				message: "Wrong password!",
			});
			return;
		}
		const token = jwt.sign(
			{
				id: user._id,
			},
			JWT_SECRET,
		);

		res.status(200).json({
			message: "User signed in successfully.",
			token,
			id: user._id,
		});
	} catch (error) {
		res.status(500).json({
			message: "Something went bonkersss!!!",
		});
	}
});

// workflow routes

// create workflow route
app.post("/workflows", authMiddleware, async (req, res) => {
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
		console.log(error.message);
		res.status(500).json({
			message: "Something went bonkersss!!!",
		});
		return;
	}
});

// update workflow route
app.patch("/workflows/:id", authMiddleware, async (req, res) => {
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
		console.log(error);
		res.status(500).json({
			message: "Something went bonkersss!!!",
		});
		return;
	}
});

// get all workflows route
app.get("/workflows", authMiddleware, async (req, res) => {
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
});

// get workflow by id
app.get("/workflows/:id", authMiddleware, async (req, res) => {
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

		const nodes = await Node.find({ workflowId: workflow._id });
		const edges = await Edge.find({ workflowId: workflow._id });

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
		console.log(error);
		res.status(500).json({
			message: "Something went bonkersss!!!",
		});
		return;
	}
});

// delete workflow
app.delete("/workflows/:id", authMiddleware, async (req, res) => {
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
		console.log(error);
		res.status(400).json({
			message: "Something went bonkersss!!!",
		});
		return;
	}
});

// node routes
// ========== CREATE NODE ==========
app.post("/nodes/:workflowId", authMiddleware, async (req, res) => {
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
		if (req.userId !== workflow.userId) {
			res.status(400).json({
				message:
					"You're unauthorised to create a node on someone else's workflow.",
			});
			return;
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
	} catch (error) {
		console.log(error);
		res.status(500).json({
			message: "Something went bonkersss!!!",
		});
		return;
	}
});

// ========== UPDATE NODE ==========
app.put("/nodes/:workflowId/:nodeId", authMiddleware, async (req, res) => {
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
		console.log(error);
		res.status(500).json({
			message: "Something went wrong while updating the node.",
		});
	}
});

// ========== GET ALL NODES (for a workflow) ==========
app.get("/nodes/:workflowId", authMiddleware, async (req, res) => {
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
		console.log(error);
		res.status(500).json({
			message: "Something went wrong while fetching nodes.",
		});
	}
});

// ========== GET SINGLE NODE BY ID ==========
app.get("/nodes/:workflowId/:nodeId", authMiddleware, async (req, res) => {
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
		console.log(error);
		res.status(500).json({
			message: "Something went wrong while fetching the node.",
		});
	}
});

// ========== DELETE NODE ==========
app.delete("/nodes/:workflowId/:nodeId", authMiddleware, async (req, res) => {
	const params = UpdateNodeSchemaParams.safeParse(req.params);

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
		console.log(error);
		res.status(500).json({
			message: "Something went wrong while deleting the node.",
		});
		return;
	}
});

// edges routes
// ========== CREATE EDGE ==========
app.post("/edges/:workflowId", authMiddleware, async (req, res) => {
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
		if (req.userId !== workflow.userId) {
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
});

// ========== DELETE EDGE ==========
app.delete("/edges/:workflowId/:edgeId", authMiddleware, async (req, res) => {
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
});

// executions routes

app.get(
	"/workflow/executions/:workflowId",
	authMiddleware,
	async (req, res) => {},
);
app.post("/credentials", authMiddleware, async (req, res) => {});
app.get("/credentials", authMiddleware, async (req, res) => {});
