import { Router } from "express";
import {
	createNode,
	deleteNode,
	getAllNodes,
	getNodeById,
	updateNode,
} from "../controllers/node.controller";

const router = Router();

router.route("/:workflowId").post(createNode).get(getAllNodes);

router
	.route("/:workflowId/:nodeId")
	.patch(updateNode)
	.delete(deleteNode)
	.get(getNodeById);

export default router;
