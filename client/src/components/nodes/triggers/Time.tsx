import type { TimeNodeMetaData } from "@/types/triggers.types";
import { Handle, Position } from "@xyflow/react";

export default function Time({
	data,
	isConnectable,
}: {
	data: {
		metaData: TimeNodeMetaData;
	};
	isConnectable: boolean;
}) {
	return (
		<div className="bg-white rounded-l-lg border border-gray-200 p-4 shadow-md w-48 text-center relative">
			<div className="text-xs absolute -bottom-6 left-0 right-0">
				Every {data.metaData.time} seconds 
			</div>
			<div className="font-bold text-black">Time {data.metaData.time}</div>
			<Handle
				type="source"
				position={Position.Right}
				isConnectable={isConnectable}
			/>
		</div>
	);
}
