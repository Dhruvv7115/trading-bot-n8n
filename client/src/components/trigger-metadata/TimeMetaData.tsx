import { Input } from "../ui/input";
import AssetSelect, { type AssetType } from "./AssetSelect";
import { Label } from "../ui/label";
export interface TimeNodeMetaData {
	time: number;
	asset: AssetType;
	action: "buy" | "sell";
}

export default function TimeMetaData({
	metaData,
	setMetaData,
}: {
	metaData: TimeNodeMetaData;
	setMetaData: (data: TimeNodeMetaData) => void;
}) {
	return (
		<div className="flex flex-col items-center justify-center gap-8">
			<AssetSelect />
			<div className="w-full">
				<Label className="text-neutral-600 mb-2 ml-0.5">
					Time Interval after which you want to buy the asset
				</Label>
				<Input
					type="number"
					placeholder="Enter time in seconds"
					value={metaData?.time || ""}
					onChange={(e) =>
						setMetaData((m: TimeNodeMetaData) => {
							return { ...m, time: parseInt(e.target.value) };
						})
					}
				></Input>
			</div>
		</div>
	);
}
