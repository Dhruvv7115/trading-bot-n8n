import { Handle, Position } from "@xyflow/react";
import { ArrowDown, ArrowUp } from "lucide-react";
import React from "react";

export default function Price({
	data,
	isConnectable,
}: {
	data: {
		metaData: {
			price: number;
			asset: string;
			action: "buy" | "sell";
			aboveOrBelow: "above" | "below" | "at";
		};
	};
	isConnectable: boolean;
}) {
	return (
		<div className="bg-white rounded-lg border border-gray-200 p-4 shadow-md w-48 text-center">
			<div className="w-full flex items-center justify-center mb-2">
				<span>
					{data.metaData.aboveOrBelow === "at" ? (
						"="
					) : data.metaData.aboveOrBelow === "below" ? (
						<ArrowDown className="text-red-600" />
					) : (
						<ArrowUp className="text-green-600" />
					)}
				</span>
				<span>{data.metaData.asset}</span>
			</div>
			<div>{data.metaData.price} USD</div>
			<div>{data.metaData.action === "buy" ? " Buy " : " Sell "}</div>
			<Handle
				type="source"
				position={Position.Right}
				isConnectable={isConnectable}
			></Handle>
		</div>
	);
}
