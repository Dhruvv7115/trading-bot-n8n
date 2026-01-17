import express, { type Request } from "express";
import { authMiddleware } from "./middleware";
import { connectToMongoDB } from "./connectDb.ts";
import { PORT } from "./constant.ts";
import cors from "cors";

const app = express();

app.use(express.json());
app.use(
	express.urlencoded({
		extended: true,
	}),
);
app.use(cors<Request>());
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

// ------------- CREDENTIAL ROUTES -------------
import credentialRoutes from "./routes/credential.routes.ts";
app.use("/api/v1/credential", authMiddleware, credentialRoutes);

connectToMongoDB().then(() =>
	app.listen(PORT, () => {
		console.log(`App is listening on PORT: ${PORT}`);
	}),
);
