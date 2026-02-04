import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import HyperliquidCredentials from "./HyperliquidCredentials";
import { AlertCircle, Shield } from "lucide-react";
import { Label } from "../ui/label";
import {
	Select,
	SelectContent,
	SelectTrigger,
	SelectValue,
	SelectItem,
} from "../ui/select";
import { exchangeInfo } from "./exchangeInfo";
import { useState } from "react";
import type { CredentialType } from "common/types";
import { Input } from "../ui/input";
import { Alert, AlertDescription } from "../ui/alert";
import LighterCredentials from "./LighterCredentials";
interface CredentialDialogProps {
	onSubmit: (data: any) => void;
	onCancel: () => void;
	open: boolean;
	onOpenChange: (open: boolean) => void;
	title: string;
	description: string;
	credential?: any;
}
function CredentialDialog({
	onSubmit,
	onCancel,
	open,
	onOpenChange,
	title = "Add a new credential",
	description = "Add your API credentials below",
	credential,
}: CredentialDialogProps) {
	const [type, setType] = useState<CredentialType>(
		credential?.type || "hyperliquid",
	);
	const [name, setName] = useState<string>(credential?.name || "");
	const [loading, setLoading] = useState<boolean>(false);
	const [error, setError] = useState<string>("");
	const currentExchange = exchangeInfo[type];
	return (
		<Dialog
			open={open}
			onOpenChange={onOpenChange}
		>
			<DialogContent>
				<DialogHeader>
					<DialogTitle>{title}</DialogTitle>
					<DialogDescription>{description}</DialogDescription>
				</DialogHeader>

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
					{type === "hyperliquid" && (
						<HyperliquidCredentials
							error={error}
							setError={setError}
							loading={loading}
							setLoading={setLoading}
							onSubmit={onSubmit}
							onCancel={onCancel}
							credential={credential}
						/>
					)}
					{type === "lighter" && (
						<LighterCredentials
							error={error}
							setError={setError}
							loading={loading}
							setLoading={setLoading}
							onSubmit={onSubmit}
							onCancel={onCancel}
							credential={credential}
						/>
					)}
				</div>
			</DialogContent>
		</Dialog>
	);
}

export default CredentialDialog;
