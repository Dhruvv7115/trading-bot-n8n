import type { PriceNodeMetaData } from "@/types/triggers.types";
import AssetSelect from "./AssetSelect";
import { Label } from "../ui/label";
import { Input } from "../ui/input";

export default function PriceMetaData({
	metaData,
	setMetaData,
}: {
	metaData: PriceNodeMetaData;
	setMetaData: (data: PriceNodeMetaData) => void;
}) {
	return (
		<div className="w-full flex flex-col items-center justify-center gap-8">
			<AssetSelect metaData={metaData} setMetaData={setMetaData} />
			<div className="w-full">
				<Label className="text-neutral-600 mb-2 ml-0.5">
					Price at which you want to trigger the action
				</Label>
				<Input
					value={metaData?.price}
					type="number"
					placeholder="Enter price in USD"
					onChange={(e) =>
						setMetaData({ ...metaData, price: parseFloat(e.target.value) })
					}
				></Input>
			</div>
		</div>
	);
}
