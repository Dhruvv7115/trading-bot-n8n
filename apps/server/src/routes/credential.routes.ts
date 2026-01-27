import { Router } from "express";
import {
	createCredential,
	deleteCredential,
	getAllCredentialsOfUser,
	getCredentialByType,
	updateCredential,
} from "../controllers/credential.controller";
import { authMiddleware } from "../middleware";

const router = Router();

router
	.route("/")
	.post(authMiddleware, createCredential)
	.get(authMiddleware, getAllCredentialsOfUser);
router.route("/:id").patch(authMiddleware, updateCredential);

export default router;
