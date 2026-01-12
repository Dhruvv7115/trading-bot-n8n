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
import { SUPPORTED_ASSETS } from "@/configs/assets.config";
import type { AssetType } from "@/types/asset.types";
import type { TriggerMetaData } from "@/types/triggers.types";

export default function AssetSelect<T extends TriggerMetaData>({
	metaData,
	setMetaData,
}: {
	metaData: T;
	setMetaData: (data: T) => void;
}) {
	return (
		<div className="w-full">
			<Label className="text-neutral-600 mb-2 ml-0.5">
				Select the Asset you want to buy
			</Label>
			<Select
				onValueChange={(value) =>
					setMetaData({ ...metaData, asset: value as AssetType })
				}
				value={metaData.asset}
			>
				<SelectTrigger className="w-full">
					<SelectValue placeholder="Select an Asset">
						{metaData.asset}
					</SelectValue>
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
