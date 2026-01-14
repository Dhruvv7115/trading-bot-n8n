import { Handle, Position } from "@xyflow/react";
import type { PriceNodeMetaData } from "common/types";

export default function Price({
	data,
	isConnectable,
}: {
	data: {
		metaData: PriceNodeMetaData
	};
	isConnectable: boolean;
}) {
	return (
		<div className="bg-white rounded-2xl outline-[1.5px] outline-gray-300 -outline-offset-[1.5px] p-5 shadow-md hover:shadow-lg transition-shadow relative min-w-[200px]">
			<h2 className="font-bold text-lg text-black mb-3">Price Trigger</h2>

			<div className="space-y-2 mb-3">
				<div className="text-neutral-800 font-semibold text-sm">
					<span className="font-light text-neutral-500">Asset: </span>
					{data.metaData.asset}
				</div>
				<div className="text-neutral-800 font-semibold text-sm">
					<span className="font-light text-neutral-500">Target Price: </span>$
					{data.metaData.price.toLocaleString()}
				</div>
			</div>

			<div className="text-xs text-neutral-500 border-t border-gray-100 pt-2">
				Triggers when {data.metaData.asset} reaches $
				{data.metaData.price.toLocaleString()}
			</div>

			<Handle
				type="source"
				position={Position.Right}
				isConnectable={isConnectable}
				style={{
					backgroundColor: "#99a1af",
					border: "none",
					width: "0.5em",
					height: "0.5em",
				}}
			/>
		</div>
	);
}
