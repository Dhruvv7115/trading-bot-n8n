import React, { useState } from "react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle, Shield } from "lucide-react";
import { Label } from "@/components/ui/label";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { Link } from "react-router-dom";
import { exchangeInfo } from "./exchangeInfo";

interface HyperliquidCredentialsProps {
	error: string;
	setError: (error: string) => void;
	loading: boolean;
	setLoading: (loading: boolean) => void;
	onSubmit: (data: any) => void;
	onCancel: () => void;
	credential?: any;
}

export default function HyperliquidCredentials({
	error,
	setError,
	loading,
	setLoading,
	onSubmit,
	onCancel,
	credential,
}: HyperliquidCredentialsProps) {
	console.log(credential);
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
			if (!name.trim()) {
				setError("Please enter a credential name");
				setLoading(false);
				return;
			}

			if (!apiKey.trim()) {
				setError("Please enter an API Key");
				setLoading(false);
				return;
			}

			if (!walletAddress.trim()) {
				setError("Please enter an API Secret");
				setLoading(false);
				return;
			}

			await onSubmit({
				name: name.trim(),
				type: "hyperliquid",
				data: {
					apiKey: apiKey.trim(),
					walletAddress: walletAddress.trim(),
				},
			});

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

	const currentExchange = exchangeInfo[credential?.type];
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
								Creating...
							</>
						) : (
							<>
								<Shield className="w-4 h-4 mr-2" />
								Create Credential
							</>
						)}
					</Button>
				</div>
			</form>
		</div>
	);
}
