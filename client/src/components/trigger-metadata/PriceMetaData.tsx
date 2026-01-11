import type { AssetType } from "./AssetSelect";
import AssetSelect from "./AssetSelect";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import {
	Select,
	SelectItem,
	SelectContent,
	SelectGroup,
	SelectTrigger,
	SelectValue,
} from "../ui/select";

export interface PriceNodeMetaData {
	price: number;
	asset: AssetType;
	action: "buy" | "sell";
	aboveOrBelow: "above" | "below" | "at";
}

export default function PriceMetaData({
	metaData,
	setMetaData,
}: {
	metaData: PriceNodeMetaData;
	setMetaData: (data: PriceNodeMetaData) => void;
}) {
	return (
		<div className="w-full flex flex-col items-center justify-center gap-8">
			<AssetSelect />
			<div className="w-full">
				<Label className="text-neutral-600 mb-2 ml-0.5">
					Price at which you want to trigger the action
				</Label>
				<Input
					value={metaData?.price || "10"}
					type="number"
					placeholder="Enter price in USD"
					onChange={(e) =>
						setMetaData((m: PriceNodeMetaData) => {
							return { ...m, price: parseFloat(e.target.value) };
						})
					}
				></Input>
			</div>
			<div className="w-full">
				<Label className="text-neutral-600 mb-2 ml-0.5">Buy or Sell</Label>
				<Select
					value={metaData?.action || "buy"}
					onValueChange={(value) =>
						setMetaData((m: PriceNodeMetaData) => {
							return { ...m, action: value };
						})
					}
					defaultValue="buy"
				>
					<SelectTrigger className="w-full">
						<SelectValue placeholder="Select action"></SelectValue>
					</SelectTrigger>
					<SelectContent>
						<SelectGroup>
							{["buy", "sell"].map((action) => (
								<SelectItem
									key={action}
									value={action}
								>
									{action.charAt(0).toUpperCase() + action.slice(1)}
								</SelectItem>
							))}
						</SelectGroup>
					</SelectContent>
				</Select>
			</div>
		</div>
	);
}
