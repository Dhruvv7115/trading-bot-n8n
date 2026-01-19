import type { ActionType, TradingMetaData } from "common/types";
import { Handle, Position } from "@xyflow/react";

export default function Hyperliquid({
	data,
	isConnectable,
}: {
	data: {
		metaData: TradingMetaData;
	};
	isConnectable: boolean;
}) {
	const { type, quantity, symbol } = data.metaData;
	return (
		<div className="bg-white rounded-2xl outline-1 outline-neutral-300 -outline-offset-1 p-4 shadow-md relative">
			<div className="flex items-center justify-between mb-2 gap-4">
				<h2 className="font-bold text-lg text-black">Hyperliquid Trade</h2>
				<img
					src="../../assets/logos/hyperliquid.png"
					alt="hyperliquid"
					className="size-5 rounded-full"
				/>
			</div>
			<div className="text-neutral-800 font-semibold text-sm">
				<span className="font-light text-neutral-500">Type: </span>
				{type}
			</div>
			<div className="text-neutral-800 font-semibold text-sm">
				<span className="font-light text-neutral-500">Quantity: </span>
				{quantity}
			</div>
			<div className="text-neutral-800 font-semibold text-sm">
				<span className="font-light text-neutral-500">Symbol: </span>
				{symbol}
			</div>
			<Handle
				type="target"
				position={Position.Left}
				isConnectable={isConnectable}
				style={{
					backgroundColor: "#99a1af",
					border: "none",
					width: "0.5em",
					height: "0.8em",
					borderRadius: "0",
				}}
			/>
			<Handle
				type="source"
				position={Position.Right}
				isConnectable={isConnectable}
				style={{
					backgroundColor: "#a1a1a1",
					border: "none",
					width: "0.5em",
					height: "0.5em",
				}}
			/>
		</div>
	);
}
