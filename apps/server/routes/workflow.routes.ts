import { Router } from "express";
import { authMiddleware } from "../middleware";
import {
	createWorkflowController,
	deleteWorkflowController,
	getAllWorkflowsController,
	getWorkflowByIdController,
	updateWorkflowController,
} from "../controllers/workflow.controller";

const router = Router();

router
	.route("/")
	.post(authMiddleware, createWorkflowController)
	.get(getAllWorkflowsController);

router
	.route("/:workflowId")
	.delete(deleteWorkflowController)
	.patch(updateWorkflowController)
	.get(getWorkflowByIdController);

export default router;
