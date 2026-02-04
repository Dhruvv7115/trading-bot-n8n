import React, { useState } from "react";
import { Shield } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { Link } from "react-router-dom";
import { exchangeInfo } from "./exchangeInfo";

interface LighterCredentialsProps {
	type: "Create" | "Update";
	error: string;
	setError: (error: string) => void;
	loading: boolean;
	setLoading: (loading: boolean) => void;
	onSubmit: (data: any) => void;
	onCancel: () => void;
	credential?: any;
}

export default function LighterCredentials({
	type = "Create",
	error,
	setError,
	loading,
	setLoading,
	onSubmit,
	onCancel,
	credential,
}: LighterCredentialsProps) {
	const [name, setName] = useState(credential?.name || "");

	const [privateKey, setPrivateKey] = useState(
		credential?.data?.privateKey || "",
	);
	const [apiKeyIndex, setApiKeyIndex] = useState(
		credential?.data?.apiKeyIndex || "",
	);
	const [accountIndex, setAccountIndex] = useState(
		credential?.data?.accountIndex || "",
	);

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setError("");
		setLoading(true);

		try {
			// Validation
			if (type === "Create" && !name.trim()) {
				setError("Please enter a credential name");
				setLoading(false);
				return;
			}

			if (type === "Create" && !privateKey.trim()) {
				setError("Please enter an Private Key");
				setLoading(false);
				return;
			}
			if (type === "Create" && !apiKeyIndex.trim()) {
				setError("Please enter an API Key Index");
				setLoading(false);
				return;
			}

			if (type === "Create" && !accountIndex.trim()) {
				setError("Please enter an Account Index");
				setLoading(false);
				return;
			}
			if (
				type === "Update" &&
				!name.trim() &&
				!privateKey.trim() &&
				!apiKeyIndex.trim() &&
				!accountIndex.trim()
			) {
				setError("Please enter at least one field to update");
				setLoading(false);
				return;
			}
			if (type === "Create") {
				onSubmit({
					name: name.trim(),
					type: "lighter",
					data: {
						privateKey: privateKey.trim(),
						apiKeyIndex: apiKeyIndex.trim(),
						accountIndex: accountIndex.trim(),
					},
				});
			} else {
				const updateData: {
					name?: string;
					data?: {
						privateKey?: string;
						apiKeyIndex?: string;
						accountIndex?: string;
					};
				} = {};
				// Check if name has changed
				if (name.trim() && name.trim() !== credential?.name) {
					updateData.name = name.trim();
				}
				// Build data object with only changed fields
				const dataFields: {
					privateKey?: string;
					apiKeyIndex?: string;
					accountIndex?: string;
				} = {};
				if (
					privateKey.trim() &&
					privateKey.trim() !== credential?.data?.privateKey
				) {
					dataFields.privateKey = privateKey.trim();
				}
				if (
					apiKeyIndex.trim() &&
					apiKeyIndex.trim() !== credential?.data?.apiKeyIndex
				) {
					dataFields.apiKeyIndex = apiKeyIndex.trim();
				}
				if (
					accountIndex.trim() &&
					accountIndex.trim() !== credential?.data?.accountIndex
				) {
					dataFields.accountIndex = accountIndex.trim();
				}

				// Only add data object if there are changes in apiKey or walletAddress
				if (Object.keys(dataFields).length > 0) {
					updateData.data = dataFields;
				}
				onSubmit(updateData);
			}

			// Reset form
			setName("");
			setPrivateKey("");
			setApiKeyIndex("");
			setAccountIndex("");
		} catch (err: any) {
			setError(err.message || "Failed to create credential");
		} finally {
			setLoading(false);
		}
	};

	const currentExchange = exchangeInfo[credential?.type || "lighter"];
	return (
		<div className="w-full max-w-2xl mx-auto">
			<form onSubmit={handleSubmit}>
				<div className="flex flex-col gap-4 mb-4">
					{/* Private Key */}
					<div className="space-y-2">
						<Label htmlFor="privateKey">
							Private Key
							<span className="text-red-500 ml-1">*</span>
						</Label>
						<Input
							id="privateKey"
							type="password"
							placeholder="Enter your Private Key"
							value={privateKey}
							onChange={(e) => setPrivateKey(e.target.value)}
							disabled={loading}
							className="font-mono text-sm"
						/>
					</div>

					{/* API Key Index */}
					<div className="space-y-2">
						<Label htmlFor="apiKeyIndex">
							API Key Index
							<span className="text-red-500 ml-1">*</span>
						</Label>
						<Input
							id="apiKeyIndex"
							type="text"
							placeholder="Enter your API Key Index"
							value={apiKeyIndex}
							onChange={(e) => setApiKeyIndex(e.target.value)}
							disabled={loading}
							className="font-mono text-sm"
						/>
						<p className="text-xs text-neutral-500">
							Your API Key Index will be encrypted before storage
						</p>
					</div>

					{/* Account Index */}
					<div className="space-y-2">
						<Label htmlFor="accountIndex">
							Account Index
							<span className="text-red-500 ml-1">*</span>
						</Label>
						<Input
							id="accountIndex"
							type="text"
							placeholder="Enter your Account Index"
							value={accountIndex}
							onChange={(e) => setAccountIndex(e.target.value)}
							disabled={loading}
							className="font-mono text-sm"
						/>
						<p className="text-xs text-neutral-500">
							Your Account Index will be encrypted before storage
						</p>
					</div>

					{/* Documentation Link */}
					<div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
						<p className="text-xs text-blue-900">
							Need help finding your API credentials?{" "}
							<Link
								to={currentExchange.docsUrl}
								className="font-medium underline hover:text-blue-700"
							>
								View {currentExchange.name} API documentation →
							</Link>
						</p>
					</div>
				</div>

				<div className="flex justify-between gap-3">
					{onCancel && (
						<Button
							type="button"
							variant="outline"
							onClick={onCancel}
							disabled={loading}
							className="flex-1"
						>
							Cancel
						</Button>
					)}
					<Button
						type="submit"
						disabled={loading}
						className="flex-1"
					>
						{loading ? (
							<>
								<Loader2 className="w-4 h-4 mr-2 animate-spin" />
								{type === "Create" ? "Creating..." : "Updating..."}
							</>
						) : (
							<>
								<Shield className="w-4 h-4 mr-2" />
								{type === "Create" ? "Create Credential" : "Update Credential"}
							</>
						)}
					</Button>
				</div>
			</form>
		</div>
	);
}
