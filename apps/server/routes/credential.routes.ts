import { Router } from "express";
import { createCredential } from "../controllers/credential.controller";

const router = Router();

router.route("/").post(createCredential);

export default router;