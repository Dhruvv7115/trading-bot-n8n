import type { ActionType, TradingMetaData } from "common/types";
import { Handle, Position } from "@xyflow/react";

export default function Hyperliquid({
	data,
	isConnectable,
}: {
	data: {
		metaData: TradingMetaData;
		label: ActionType;
	};
	isConnectable: boolean;
}) {
	return (
		<div className="bg-white rounded-2xl outline-[1.5px] outline-gray-400 -outline-offset-[1.5px] p-4 shadow-md relative">
			<h2 className="font-bold text-lg mb-2">{data.label} Trade</h2>
			<div className="text-neutral-800 font-semibold text-sm">
				<span className="font-light text-neutral-500">Type: </span>
				{data.metaData.type}
			</div>
			<div className="text-neutral-800 font-semibold text-sm">
				<span className="font-light text-neutral-500">Qty: </span>
				{data.metaData.quantity}
			</div>
			<div className="text-neutral-800 font-semibold text-sm">
				<span className="font-light text-neutral-500">Symbol: </span>
				{data.metaData.symbol}
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
			<Handle
				type="target"
				position={Position.Left}
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
