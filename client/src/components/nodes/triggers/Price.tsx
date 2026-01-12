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
			<div className="w-full flex items-center justify-center text-black font-bold">
				{data.metaData.asset} {data.metaData.price}
			</div>
			<Handle
				type="source"
				position={Position.Right}
				isConnectable={isConnectable}
			></Handle>
			<div className="text-sm absolute -bottom-12 left-0 right-0 text-neutral-500">
				On Price of {data.metaData.asset} reaching {data.metaData.price} USD
			</div>
		</div>
	);
}
