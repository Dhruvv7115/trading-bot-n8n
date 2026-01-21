import { Router } from "express";
import { getAllExecutionsByWorkflowId } from "../controllers/execution.controller";
import { executeWorkflowController } from "../controllers/execution.controller";

const router = Router();

router.route("/:workflowId").get(getAllExecutionsByWorkflowId);
router.route("/workflows/:workflowId/execute").post(executeWorkflowController);
export default router;
