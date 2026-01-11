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
		<div className="bg-white rounded-l-2xl rounded-r border border-gray-200 p-4 shadow-md text-center text-sm">
			Every {data.metaData.time} seconds,
			<div>Buys {data.metaData.asset}</div>
			<Handle
				type="source"
				position={Position.Right}
				isConnectable={isConnectable}
			/>
		</div>
	);
}
