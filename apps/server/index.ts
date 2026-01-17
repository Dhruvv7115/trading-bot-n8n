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
import { Edge, Node, Workflow } from "db/schemas";
import { authMiddleware } from "./middleware";
import { connectToMongoDB } from "./connectDb.ts";
import { PORT } from "./constant.ts";

const app = express();

app.use(express.json());
app.use(
	express.urlencoded({
		extended: true,
	}),
);

// =============== ROUTES ===============

// ------------- USER ROUTES -------------
import authRoutes from "./routes/auth.routes.ts";
app.use("/api/v1/auth", authRoutes);

// ------------- WORKFLOW ROUTES -------------
import workflowRoutes from "./routes/workflow.routes.ts";
app.use("/api/v1/workflow", authMiddleware, workflowRoutes);

// ------------- NODE ROUTES -------------
import nodeRoutes from "./routes/node.routes.ts";
app.use("/api/v1/node", authMiddleware, nodeRoutes);

// ------------- EDGE ROUTES -------------
import edgeRoutes from "./routes/edge.routes.ts";
app.use("/api/v1/edge", authMiddleware, edgeRoutes);

// ------------- EXECUTION ROUTES -------------
import executionRoutes from "./routes/execution.routes.ts";
app.use("/api/v1/execution", authMiddleware, executionRoutes);

connectToMongoDB().then(() =>
	app.listen(PORT, () => {
		console.log(`App is listening on PORT: ${PORT}`);
	}),
);

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
