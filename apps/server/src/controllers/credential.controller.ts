import {
	CreateCredentialSchemaBody,
	GetCredentialSchemaBody,
	GetCredentialSchemaParams,
	UpdateCredentialSchemaBody,
	UpdateCredentialSchemaParams,
} from "common/types";
import { Credential } from "db/schemas";
import type { Request, Response } from "express";
import { encryptCredentialData } from "common/utils";

const createCredential = async (req: Request, res: Response) => {
	try {
		const body = CreateCredentialSchemaBody.safeParse(req.body);

		if (!body.success) {
			return res.status(400).json({
				message: "Invalid credential data",
				errors: body.error.message,
			});
		}

		const { name, type, data } = body.data;

		// Encrypt sensitive data before storing
		const encryptedApiKey = encryptCredentialData(data.apiKey);
		const encryptedApiSecret = encryptCredentialData(data.apiSecret);
		const credential = await Credential.create({
			name,
			type,
			data: {
				apiKey: encryptedApiKey,
				apiSecret: encryptedApiSecret,
			},
			userId: req.userId,
		});
		res.status(201).json({
			message: "Credential created successfully",
			credential: {
				_id: credential._id,
				name: credential.name,
				type: credential.type,
			},
		});
	} catch (error: any) {
		res.status(500).json({ message: error.message });
	}
};

const getAllCredentialsOfUser = async (req: Request, res: Response) => {
	try {
		const credentials = await Credential.find({ userId: req.userId })
			.select("_id name type createdAt updatedAt")
			.lean();

		res.status(200).json({
			message: "Credentials fetched successfully",
			credentials,
		});
	} catch (error: any) {
		res.status(500).json({ message: error.message });
	}
};

const getCredentialByType = async (req: Request, res: Response) => {
	const { success, data } = GetCredentialSchemaBody.safeParse(req.body);
	if (!success) {
		return res.status(400).json({ error: data });
	}
	try {
		const { type } = data;

		const credentials = await Credential.find({
			userId: req.userId,
			type,
		})
			.select("_id name type")
			.lean();

		res.status(200).json({
			message: "Credentials fetched successfully",
			credentials,
		});
	} catch (error: any) {
		res.status(500).json({ message: error.message });
	}
};

const getCredentialById = async (req: Request, res: Response) => {
	const { success, data } = GetCredentialSchemaParams.safeParse(req.params);
	if (!success) {
		return res.status(400).json({ error: data });
	}
	try {
		const { id } = data;

		const credential = await Credential.findOne({
			userId: req.userId,
			_id: id,
		})
			.select("_id name type")
			.lean();

		res.status(200).json({
			message: "Credential fetched successfully",
			credential,
		});
	} catch (error: any) {
		res.status(500).json({ message: error.message });
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

const deleteCredential = async (req: Request, res: Response) => {
	const { success, data } = UpdateCredentialSchemaParams.safeParse(req.params);
	if (!success) {
		return res.status(400).json({ error: data });
	}
	try {
		const credential = await Credential.findOneAndDelete({
			_id: data.id,
			userId: req.userId,
		});

		if (!credential) {
			return res.status(404).json({ message: "Credential not found" });
		}

		res.status(200).json({
			message: "Credential deleted successfully",
		});
	} catch (error: any) {
		res.status(500).json({ message: error.message });
	}
};

export {
	createCredential,
	getAllCredentialsOfUser,
	getCredentialByType,
	getCredentialById,
	updateCredential,
	deleteCredential,
};
