import type { TimeNodeMetaData } from "common/types";
import { Handle, Position } from "@xyflow/react";
import { AlarmClock } from "lucide-react";

export default function Time({
	data,
	isConnectable,
}: {
	data: {
		metaData: TimeNodeMetaData;
	};
	isConnectable: boolean;
}) {
	const formatTime = (seconds: number) => {
		if (seconds < 60) return `${seconds}s`;
		if (seconds < 3600) return `${Math.floor(seconds / 60)}m ${seconds % 60}s`;
		const hours = Math.floor(seconds / 3600);
		const mins = Math.floor((seconds % 3600) / 60);
		return `${hours}h ${mins}m`;
	};

	return (
		<div className="bg-white rounded-l-4xl rounded-r-lg outline-1 outline-neutral-400 -outline-offset-1 p-5 shadow-md hover:shadow-lg transition-shadow relative min-w-[200px]">
			<div className="flex items-center justify-between mb-2">
				<h2 className="font-bold text-lg text-black">Timer Trigger</h2>
				<AlarmClock className="text-neutral-500 size-5" />
			</div>
			<div className="space-y-2 mb-3">
				<div className="text-neutral-800 font-semibold text-sm">
					<span className="font-light text-neutral-500">Interval: </span>
					{formatTime(data.metaData.time)}
				</div>
				<div className="text-xs text-neutral-500">
					({data.metaData.time} seconds)
				</div>
			</div>

			<div className="text-xs text-neutral-500 border-t border-gray-100 pt-2">
				Triggers every {formatTime(data.metaData.time)}
			</div>

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
