import { Router } from "express";
import {
	createCredential,
	deleteCredential,
	getAllCredentialsOfUser,
	getCredentialById,
	getCredentialByType,
	updateCredential,
} from "../controllers/credential.controller";
import { authMiddleware } from "../middleware";

const router = Router();

router
	.route("/")
	.post(authMiddleware, createCredential)
	.get(authMiddleware, getAllCredentialsOfUser);
router
	.route("/:id")
	.get(authMiddleware, getCredentialById)
	.patch(authMiddleware, updateCredential);
router.route("/type").get(authMiddleware, getCredentialByType);
export default router;
