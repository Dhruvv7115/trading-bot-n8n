import React from "react";
import {
	Select,
	SelectContent,
	SelectGroup,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";

import type { AssetType } from "@/types/asset.types";
const SUPPORTED_ASSETS: AssetType[] = ["SOL", "ETH", "BTC"];

export default function AssetSelect() {
	return (
		<div className="w-full">
			<Label className="text-neutral-600 mb-2 ml-0.5">
				Select the Asset you want to buy
			</Label>
			<Select>
				<SelectTrigger className="w-full">
					<SelectValue placeholder="Select an Asset"></SelectValue>
				</SelectTrigger>
				<SelectContent>
					<SelectGroup>
						{SUPPORTED_ASSETS.map((asset) => (
							<SelectItem
								key={asset}
								value={asset}
								className="flex-row gap-2"
							>
								{asset}
							</SelectItem>
						))}
					</SelectGroup>
				</SelectContent>
			</Select>
		</div>
	);
}
