import { Input } from "@/components/ui/input";
import AssetSelect from "./AssetSelect";
import { Label } from "@/components/ui/label";
import type { TimeNodeMetaData } from "common/types";

export default function TimeMetaData({
	metaData,
	setMetaData,
}: {
	metaData: TimeNodeMetaData;
	setMetaData: (data: TimeNodeMetaData) => void;
}) {
	return (
		<div className="flex flex-col items-center justify-center gap-8">
			<AssetSelect metaData={metaData} setMetaData={setMetaData} />
			<div className="w-full">
				<Label className="text-neutral-600 mb-2 ml-0.5">
					Time Interval after which you want to buy the asset
				</Label>
				<Input
					type="number"
					placeholder="Enter time in seconds"
					value={metaData?.time || ""}
					onChange={(e) =>
						setMetaData({ ...metaData, time: parseInt(e.target.value) })
					}
				></Input>
			</div>
		</div>
	);
}
