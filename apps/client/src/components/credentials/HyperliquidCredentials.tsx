import React, { useState } from "react";
import { Shield } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { Link } from "react-router-dom";
import { exchangeInfo } from "./exchange-info";

interface HyperliquidCredentialsProps {
	type: "Create" | "Update";
	error: string;
	setError: (error: string) => void;
	loading: boolean;
	setLoading: (loading: boolean) => void;
	onSubmit: (data: any) => void;
	onCancel: () => void;
	credential?: any;
}

export default function HyperliquidCredentials({
	type = "Create",
	error,
	setError,
	loading,
	setLoading,
	onSubmit,
	onCancel,
	credential,
}: HyperliquidCredentialsProps) {
	const [name, setName] = useState(credential?.name || "");
	const [apiKey, setApiKey] = useState(credential?.data?.apiKey || "");
	const [walletAddress, setWalletAddress] = useState(
		credential?.data?.walletAddress || "",
	);
	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setError("");
		setLoading(true);

		try {
			// Validation
			if (!name.trim() && type === "Create") {
				setError("Please enter a credential name");
				setLoading(false);
				return;
			}

			if (!apiKey.trim() && type === "Create") {
				setError("Please enter an API Key");
				setLoading(false);
				return;
			}

			if (!walletAddress.trim() && type === "Create") {
				setError("Please enter an API Secret");
				setLoading(false);
				return;
			}

			if (
				type === "Update" &&
				!name.trim() &&
				!walletAddress.trim() &&
				!apiKey.trim()
			) {
				setError("Please enter at least one field");
				setLoading(false);
				return;
			}

			if (type === "Create") {
				onSubmit({
					name: name.trim(),
					type: "hyperliquid",
					data: {
						apiKey: apiKey.trim(),
						walletAddress: walletAddress.trim(),
					},
				});
			} else {
				// For Update, only send fields that have been modified
				const updateData: { name?: string; data?: any } = {};

				// Check if name has changed
				if (name.trim() && name.trim() !== credential?.name) {
					updateData.name = name.trim();
				}

				// Build data object with only changed fields
				const dataFields: { apiKey?: string; walletAddress?: string } = {};
				if (apiKey.trim() && apiKey.trim() !== credential?.data?.apiKey) {
					dataFields.apiKey = apiKey.trim();
				}
				if (
					walletAddress.trim() &&
					walletAddress.trim() !== credential?.data?.walletAddress
				) {
					dataFields.walletAddress = walletAddress.trim();
				}

				// Only add data object if there are changes in apiKey or walletAddress
				if (Object.keys(dataFields).length > 0) {
					updateData.data = dataFields;
				}

				onSubmit(updateData);
			}

			// Reset form
			setName("");
			setApiKey("");
			setWalletAddress("");
		} catch (err: any) {
			setError(err.message || "Failed to create credential");
		} finally {
			setLoading(false);
		}
	};

	const currentExchange = exchangeInfo[credential?.type || "hyperliquid"];
	return (
		<div className="w-full max-w-2xl mx-auto">
			<form onSubmit={handleSubmit}>
				<div className="flex flex-col gap-4 mb-4">
					{/* API Key */}
					<div className="space-y-2">
						<Label htmlFor="apiKey">
							API Key
							<span className="text-red-500 ml-1">*</span>
						</Label>
						<Input
							id="apiKey"
							type="password"
							placeholder="Enter your API key"
							value={apiKey}
							onChange={(e) => setApiKey(e.target.value)}
							disabled={loading}
							className="font-mono text-sm"
						/>
					</div>

					{/* API Secret */}
					<div className="space-y-2">
						<Label htmlFor="walletAddress">
							Wallet Address
							<span className="text-red-500 ml-1">*</span>
						</Label>
						<Input
							id="walletAddress"
							type="text"
							placeholder="Enter your wallet address"
							value={walletAddress}
							onChange={(e) => setWalletAddress(e.target.value)}
							disabled={loading}
							className="font-mono text-sm"
						/>
						<p className="text-xs text-neutral-500">
							Your API secret will be encrypted before storage
						</p>
					</div>

					{/* Documentation Link */}
					<div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
						<p className="text-xs text-blue-900">
							Need help finding your API credentials?{" "}
							<Link
								to={currentExchange?.docsUrl || "#"}
								className="font-medium underline hover:text-blue-700"
							>
								View {currentExchange?.name} API documentation →
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
