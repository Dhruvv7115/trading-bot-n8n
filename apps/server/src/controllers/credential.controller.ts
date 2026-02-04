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
		let credentialData: any = {};
		if (type === "hyperliquid") {
			if (!data.apiKey || !data.walletAddress) {
				return res.status(400).json({ message: "Invalid credential data" });
			}
			credentialData.apiKey = encryptCredentialData(data.apiKey);
			credentialData.walletAddress = encryptCredentialData(data.walletAddress);
		} else if (type === "lighter") {
			if (!data.privateKey || !data.apiKeyIndex || !data.accountIndex) {
				return res.status(400).json({ message: "Invalid credential data" });
			}
			credentialData.privateKey = encryptCredentialData(data.privateKey);
			credentialData.apiKeyIndex = encryptCredentialData(data.apiKeyIndex);
			credentialData.accountIndex = encryptCredentialData(data.accountIndex);
		}
		const credential = await Credential.create({
			name,
			type,
			data: credentialData,
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
		return res.status(400).json({ error: body.error || params.error });
	}
	const { name, type, data } = body.data;
	try {
		const credential = await Credential.findById(params.data.id);
		if (!credential) {
			return res.status(404).json({ error: "Credential not found" });
		}
		if (credential.userId.toString() !== req.userId) {
			return res.status(403).json({ error: "Unauthorized" });
		}

		let credentialData: any = {};
		if (type === "hyperliquid" || credential.type === "hyperliquid") {
			if (data.apiKey) {
				credentialData.apiKey = encryptCredentialData(data.apiKey);
			}
			if (data.walletAddress) {
				credentialData.walletAddress = encryptCredentialData(
					data.walletAddress,
				);
			}
		} else if (type === "lighter" || credential.type === "lighter") {
			if (data.privateKey) {
				credentialData.privateKey = encryptCredentialData(data.privateKey);
			}
			if (data.apiKeyIndex) {
				credentialData.apiKeyIndex = encryptCredentialData(data.apiKeyIndex);
			}
			if (data.accountIndex) {
				credentialData.accountIndex = encryptCredentialData(data.accountIndex);
			}
		}

		const updatedCredential = await Credential.updateOne(
			{ _id: params.data.id, userId: req.userId },
			{
				$set: {
					name: name || credential.name,
					type: type || credential.type,
					data: {
						...credential.data,
						...credentialData,
					},
				},
			},
		);
		return res.status(201).json({
			message: "Credential updated successfully",
			credential: updatedCredential,
		});
	} catch (error: any) {
		return res.status(500).json({ error: error.message });
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
