import { Router } from "express";
import { createEdge, deleteEdge } from "../controllers/edge.controller";

const router = Router();

router.route("/:workflowId").post(createEdge);
router.route("/:workflowId/:edgeId").delete(deleteEdge);

export default router;
