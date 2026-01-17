import { Router } from "express";
import { createCredential, updateCredential } from "../controllers/credential.controller";

const router = Router();

router.route("/").post(createCredential);
router.route("/:id").patch(updateCredential);

export default router;