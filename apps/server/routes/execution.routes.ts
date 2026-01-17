import { Router } from "express";
import { getAllExecutionsByWorkflowId } from "../controllers/execution.controller";

const router = Router();

router.route("/:workflowId").get(getAllExecutionsByWorkflowId);

export default router;
