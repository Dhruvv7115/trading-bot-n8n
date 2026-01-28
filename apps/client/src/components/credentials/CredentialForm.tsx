// components/CredentialForm.tsx
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Shield, AlertCircle, Loader2 } from "lucide-react";
import { Link } from "react-router-dom";

type CredentialType = "hyperliquid" | "lighter" | "backpack";

interface CredentialFormProps {
	onSubmit: (data: {
		name: string;
		type: CredentialType;
		data: any;
	}) => Promise<void>;
	onCancel?: () => void;
	credential?: any;
}

export function CredentialForm({
	onSubmit,
	onCancel,
	credential,
}: CredentialFormProps) {
	console.log(credential);
	const [name, setName] = useState(credential?.name || "");
	const [type, setType] = useState<CredentialType>(
		credential?.type || "hyperliquid",
	);
	const [apiKey, setApiKey] = useState(credential?.data?.apiKey || "");
	const [apiSecret, setApiSecret] = useState(credential?.data?.apiSecret || "");
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState("");

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

			if (!apiSecret.trim()) {
				setError("Please enter an API Secret");
				setLoading(false);
				return;
			}

			await onSubmit({
				name: name.trim(),
				type,
				data: {
					apiKey: apiKey.trim(),
					apiSecret: apiSecret.trim(),
				},
			});

			// Reset form
			setName("");
			setApiKey("");
			setApiSecret("");
		} catch (err: any) {
			setError(err.message || "Failed to create credential");
		} finally {
			setLoading(false);
		}
	};

	const exchangeInfo = {
		hyperliquid: {
			name: "Hyperliquid",
			description: "Decentralized perpetual futures exchange",
			docsUrl:
				"https://hyperliquid.gitbook.io/hyperliquid-docs/for-developers/api",
		},
		lighter: {
			name: "Lighter",
			description: "High-performance DEX for spot and perpetuals",
			docsUrl: "#",
		},
		backpack: {
			name: "Backpack",
			description: "Crypto exchange built by Mad Lads",
			docsUrl: "https://docs.backpack.exchange/",
		},
	};

	const currentExchange = exchangeInfo[type];

	return (
		<div className="w-full max-w-2xl mx-auto">
			<form onSubmit={handleSubmit}>
				<div className="flex flex-col gap-4 mb-4">
					{/* Error Alert */}
					{error && (
						<Alert variant="destructive">
							<AlertCircle className="h-4 w-4" />
							<AlertDescription>{error}</AlertDescription>
						</Alert>
					)}

					{/* Security Notice */}
					<div className="flex items-center justify-between gap-4 border border-neutral-200 rounded-lg p-2 text-neutral-500">
						<Shield className="w-12 h-12 text-neutral-900" />
						<p>
							Your credentials are encrypted using AES-256-GCM before being
							stored. Never share your API secrets with anyone.
						</p>
					</div>

					{/* Exchange Type */}
					<div className="space-y-2">
						<Label htmlFor="type">Exchange</Label>
						<Select
							value={type}
							onValueChange={(value) => setType(value as CredentialType)}
						>
							<SelectTrigger id="type">
								<SelectValue placeholder="Select exchange" />
							</SelectTrigger>
							<SelectContent>
								<SelectItem value="hyperliquid">
									<div className="flex items-center gap-2">
										<div className="w-2 h-2 bg-purple-500 rounded-full"></div>
										Hyperliquid
									</div>
								</SelectItem>
								<SelectItem value="lighter">
									<div className="flex items-center gap-2">
										<div className="w-2 h-2 bg-orange-500 rounded-full"></div>
										Lighter
									</div>
								</SelectItem>
								<SelectItem value="backpack">
									<div className="flex items-center gap-2">
										<div className="w-2 h-2 bg-green-500 rounded-full"></div>
										Backpack
									</div>
								</SelectItem>
							</SelectContent>
						</Select>
						<p className="text-xs text-neutral-500">
							{currentExchange.description}
						</p>
					</div>

					{/* Credential Name */}
					<div className="space-y-2">
						<Label htmlFor="name">
							Credential Name
							<span className="text-red-500 ml-1">*</span>
						</Label>
						<Input
							id="name"
							placeholder={`My ${currentExchange.name} Account`}
							value={name}
							onChange={(e) => setName(e.target.value)}
							disabled={loading}
						/>
						<p className="text-xs text-neutral-500">
							A friendly name to identify this credential
						</p>
					</div>

					{/* API Key */}
					<div className="space-y-2">
						<Label htmlFor="apiKey">
							API Key
							<span className="text-red-500 ml-1">*</span>
						</Label>
						<Input
							id="apiKey"
							type="text"
							placeholder="Enter your API key"
							value={apiKey}
							onChange={(e) => setApiKey(e.target.value)}
							disabled={loading}
							className="font-mono text-sm"
						/>
					</div>

					{/* API Secret */}
					<div className="space-y-2">
						<Label htmlFor="apiSecret">
							API Secret
							<span className="text-red-500 ml-1">*</span>
						</Label>
						<Input
							id="apiSecret"
							type="password"
							placeholder="Enter your API secret"
							value={apiSecret}
							onChange={(e) => setApiSecret(e.target.value)}
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
