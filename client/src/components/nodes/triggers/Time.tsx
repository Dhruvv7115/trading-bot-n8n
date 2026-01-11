import type { TimeNodeMetaData } from "@/components/trigger-metadata/TimeMetaData";
import { Handle, Position } from "@xyflow/react";
import React from "react";

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
		<div className="bg-white rounded-lg border border-gray-200 p-4 shadow-md w-48 text-center text-sm">
			Every {data.metaData.time} seconds, Buys {data.metaData.asset}
			<Handle
				type="source"
				position={Position.Right}
        isConnectable={isConnectable}
			>
			</Handle>
		</div>
	);
}
