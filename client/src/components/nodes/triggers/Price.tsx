import { Handle, Position } from "@xyflow/react";

export default function Price({
	data,
	isConnectable,
}: {
	data: {
		metaData: {
			price: number;
			asset: string;
		};
	};
	isConnectable: boolean;
}) {
	return (
		<div className="bg-white rounded-l-lg border border-gray-200 p-4 shadow-md w-48 text-center relative">
			<div className="w-full flex items-center justify-center">
				{data.metaData.asset}
			</div>
			<Handle
				type="source"
				position={Position.Right}
				isConnectable={isConnectable}
			></Handle>
			<div className="text-sm absolute -bottom-6 left-0 right-0">
				Price Trigger at
				{data.metaData.price} USD{" "}
			</div>
		</div>
	);
}
