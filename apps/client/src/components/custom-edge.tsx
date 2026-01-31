// components/CustomEdge.tsx
import { BaseEdge, type EdgeProps, getBezierPath } from "@xyflow/react";

export function CustomEdge({
	id,
	sourceX, // X position where edge starts
	sourceY, // Y position where edge starts
	targetX, // X position where edge ends
	targetY, // Y position where edge ends
	sourcePosition, // Direction: 'top' | 'right' | 'bottom' | 'left'
	targetPosition, // Direction: 'top' | 'right' | 'bottom' | 'left'
	markerEnd, // The arrow at the end
	style = {},
}: EdgeProps) {
	// Calculate the path (curved line)
	const [edgePath] = getBezierPath({
		sourceX,
		sourceY,
		sourcePosition,
		targetX,
		targetY,
		targetPosition,
	});

	return (
		<BaseEdge
			id={id}
			path={edgePath}
			markerEnd={markerEnd}
			style={{
				...style,
				strokeDasharray: "5, 5",
				strokeWidth: 1.5,
				animation: "dashdraw 0.5s linear infinite",
			}}
		/>
	);
}
