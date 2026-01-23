import { Router } from "express";
import {
	createCredential,
	deleteCredential,
	getCredentialByType,
	updateCredential,
} from "../controllers/credential.controller";
import { authMiddleware } from "../middleware";

const router = Router();

router.route("/").post(authMiddleware, createCredential);
router.route("/:id").patch(authMiddleware, updateCredential);

export default router;
