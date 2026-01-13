import type { TradingMetaData } from "@/types/actions.types";
import {
	Select,
	SelectContent,
	SelectGroup,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { SUPPORTED_ASSETS } from "@/configs/assets.config";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import type { AssetType } from "@/types/asset.types";

export default function ExchangeMetaData({
	metaData,
	setMetaData,
}: {
	metaData: TradingMetaData;
	setMetaData: (data: TradingMetaData | {}) => void;
}) {
	return (
		<div className="flex flex-col items-center justify-center gap-4 w-full">
			<div className="w-full">
				<Label className="text-neutral-600 mb-2 ml-0.5">
					Type of trade (LONG/SHORT)
				</Label>
				<Select
					value={metaData.type || ""}
					onValueChange={(value: TradingMetaData["type"]) =>
						setMetaData({ ...metaData, type: value })
					}
				>
					<SelectTrigger className="w-full">
						<SelectValue placeholder="Select the type of trade" />
					</SelectTrigger>
					<SelectContent>
						<SelectGroup>
							<SelectItem value="LONG">LONG</SelectItem>
							<SelectItem value="SHORT">SHORT</SelectItem>
						</SelectGroup>
					</SelectContent>
				</Select>
			</div>
			<div className="w-full">
				<Label className="text-neutral-600 mb-2 ml-0.5">Symbol of Asset</Label>
				<Select
					value={metaData.symbol || ""}
					onValueChange={(value: AssetType) =>
						setMetaData({ ...metaData, symbol: value })
					}
				>
					<SelectTrigger className="w-full">
						<SelectValue placeholder="Select the symbol" />
					</SelectTrigger>
					<SelectContent>
						<SelectGroup>
							{SUPPORTED_ASSETS.map((asset) => (
								<SelectItem
									key={asset}
									value={asset}
								>
									{asset}
								</SelectItem>
							))}
						</SelectGroup>
					</SelectContent>
				</Select>
			</div>
			<div className="w-full">
				<Label className="text-neutral-600 mb-2 ml-0.5">
					Quantity of Asset
				</Label>
				<Input
					type="number"
					placeholder="Enter the quantity of asset"
					value={metaData.quantity ?? ""}
					onChange={(e) => {
						const value = e.target.value;
						if (value === "") {
							const { quantity, ...rest } = metaData;
							setMetaData(rest);
						} else {
							const numValue = parseInt(value, 10);
							if (!isNaN(numValue)) {
								setMetaData({ ...metaData, quantity: numValue });
							}
						}
					}}
				/>
			</div>
		</div>
	);
}
