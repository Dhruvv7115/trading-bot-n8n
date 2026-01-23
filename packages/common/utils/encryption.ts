import crypto from "crypto";

// Algorithm is NOT a secret, it's fine to hardcode
const ALGORITHM = "aes-256-gcm";
const ENCRYPTION_KEY = process.env.ENCRYPTION_KEY!; // Must be 32 bytes (64 hex chars)

if (!ENCRYPTION_KEY) {
	throw new Error("ENCRYPTION_KEY environment variable is required");
}

// Validate key length
if (ENCRYPTION_KEY.length !== 64) {
	throw new Error("ENCRYPTION_KEY must be 32 bytes (64 hex characters)");
}

export function encryptCredentialData(data: any): string {
	const iv = crypto.randomBytes(16);

	const cipher = crypto.createCipheriv(
		ALGORITHM,
		Buffer.from(ENCRYPTION_KEY, "hex"),
		iv,
	);

	let encrypted = cipher.update(JSON.stringify(data), "utf8", "hex");
	encrypted += cipher.final("hex");

	const authTag = cipher.getAuthTag();

	// Return IV + AuthTag + Encrypted data
	return iv.toString("hex") + ":" + authTag.toString("hex") + ":" + encrypted;
}

export function decryptCredentialData(encryptedData: string): any {
	const parts = encryptedData.split(":");

	if (parts.length !== 3) {
		throw new Error("Invalid encrypted data format: expected 3 parts");
	}

	const [ivHex, authTagHex, encrypted] = parts as [string, string, string];

	const iv = Buffer.from(ivHex, "hex");
	const authTag = Buffer.from(authTagHex, "hex");

	const decipher = crypto.createDecipheriv(
		ALGORITHM,
		Buffer.from(ENCRYPTION_KEY, "hex"),
		iv,
	);

	decipher.setAuthTag(authTag); 

	let decrypted = decipher.update(encrypted, "hex", "utf8");
	decrypted += decipher.final("utf8");

	return JSON.parse(decrypted);
}
