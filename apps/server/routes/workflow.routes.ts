import { Router } from "express";
import {
	createWorkflowController,
	deleteWorkflowController,
	getAllWorkflowsController,
	getWorkflowByIdController,
	updateWorkflowController,
} from "../controllers/workflow.controller";

const router = Router();

router.route("/").post(createWorkflowController).get(getAllWorkflowsController);

router
	.route("/:id")
	.delete(deleteWorkflowController)
	.patch(updateWorkflowController)
	.get(getWorkflowByIdController);

export default router;
