import {
	CreateCredentialSchemaBody,
	UpdateCredentialSchemaBody,
	UpdateCredentialSchemaParams,
} from "common/types";
import { Credential } from "db/schemas";
import type { Request, Response } from "express";

const createCredential = async (req: Request, res: Response) => {
	const { success, data } = CreateCredentialSchemaBody.safeParse(req.body);
	if (!success) {
		return res.status(400).json({ error: data });
	}
	try {
		const credential = await Credential.create({ ...data, userId: req.userId });
		return res.status(201).json({ credential });
	} catch (error) {
		return res.status(500).json({ error });
	}
};

const updateCredential = async (req: Request, res: Response) => {
	const body = UpdateCredentialSchemaBody.safeParse(req.body);
	const params = UpdateCredentialSchemaParams.safeParse(req.params);
	if (!body.success || !params.success) {
		return res.status(400).json({ error: body.data || params.data });
	}
	try {
		const credential = await Credential.findByIdAndUpdate(
			params.data.id,
			body.data,
			{ new: true },
		);
		if (!credential) {
			return res.status(404).json({ error: "Credential not found" });
		}
		return res
			.status(201)
			.json({ message: "Credential updated successfully", credential });
	} catch (error) {
		return res.status(500).json({ error });
	}
};

export { createCredential, updateCredential };
