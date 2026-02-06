import { Handle, Position } from "@xyflow/react";
import type { PriceNodeMetaData } from "common/types";
import { IndianRupee } from "lucide-react";

export default function Price({
	data,
	isConnectable,
}: {
	data: {
		metaData: PriceNodeMetaData;
	};
	isConnectable: boolean;
}) {
	return (
		<div className="bg-card rounded-2xl outline-[1.5px] outline-border -outline-offset-[1.5px] p-5 shadow-md hover:shadow-lg transition-shadow relative min-w-[200px]">
			<div className="flex items-center justify-between mb-2">
				<h2 className="font-bold text-lg text-card-foreground">
					Price Trigger
				</h2>
				<IndianRupee className="size-5 text-muted-foreground" />
			</div>

			<div className="space-y-2 mb-3">
				<div className="text-foreground font-semibold text-sm">
					<span className="font-light text-muted-foreground">Asset: </span>
					{data.metaData.asset}
				</div>
				<div className="text-foreground font-semibold text-sm">
					<span className="font-light text-muted-foreground">
						Target Price:{" "}
					</span>
					${data.metaData.price.toLocaleString()}
				</div>
			</div>

			<div className="text-xs text-muted-foreground border-t border-border pt-2">
				Triggers when {data.metaData.asset} reaches $
				{data.metaData.price.toLocaleString()}
			</div>

			<Handle
				type="source"
				position={Position.Right}
				isConnectable={isConnectable}
				style={{
					backgroundColor: "var(--muted-foreground)",
					border: "none",
					width: "0.5em",
					height: "0.5em",
				}}
			/>
		</div>
	);
}
