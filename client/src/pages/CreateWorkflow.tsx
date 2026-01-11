import { useState, useCallback } from "react";
import {
	ReactFlow,
	addEdge,
	applyNodeChanges,
	applyEdgeChanges,
	type Edge,
	type OnConnect,
	type OnEdgesChange,
	type NodeChange,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import TriggerSheet from "@/components/TriggerSheet";
import Time from "@/components/nodes/triggers/Time";
import Price from "@/components/nodes/triggers/Price";
import type { PriceNodeMetaData } from "@/components/trigger-metadata/PriceMetaData";
import type { TimeNodeMetaData } from "@/components/trigger-metadata/TimeMetaData";

export type TriggerType = "time" | "price";
export type ActionType = "hyperliquid" | "backpack" | "lighter";
export type MetaData = PriceNodeMetaData | TimeNodeMetaData;

interface NodeType {
	id: string;
	position: { x: number; y: number };
	type: TriggerType;
	data: {
		actionType?: ActionType;
		metaData: MetaData;
		label: string;
	};
}
const nodeTypes = {
	time: Time,
	price: Price,
};

export default function CreateWorkflowPage() {
	const [nodes, setNodes] = useState<NodeType[]>([]);
	const [edges, setEdges] = useState<Edge[]>([]);

	const onNodesChange = useCallback(
		(changes: NodeChange<NodeType>[]) =>
			setNodes((nds) => applyNodeChanges<NodeType>(changes, nds)),
		[setNodes],
	);
	const onEdgesChange: OnEdgesChange = useCallback(
		(changes) => setEdges((eds) => applyEdgeChanges(changes, eds)),
		[setEdges],
	);
	const onConnect: OnConnect = useCallback(
		(connection) => setEdges((eds) => addEdge(connection, eds)),
		[setEdges],
	);

	const onTriggerSelect = (trigger: TriggerType, metaData: MetaData) => {
		setNodes((p) => [
			...p,
			{
				id: `${trigger}-${p.length + 1}`,
				position: {
					x: 0,
					y: 0,
				},
				type: trigger,
				data: {
					metaData: metaData,
					label: trigger.charAt(0).toUpperCase() + trigger.slice(1),
				},
			},
		]);
	};
	return (
		<div
			style={{ width: "100vw", height: "100vh" }}
			className="relative"
		>
			{nodes.length === 0 && (
				<TriggerSheet
					onTriggerSelect={(trigger, metaData) =>
						onTriggerSelect(trigger, metaData)
					}
				/>
			)}
			<ReactFlow
				nodeTypes={nodeTypes}
				nodes={nodes}
				edges={edges}
				onNodesChange={onNodesChange}
				onEdgesChange={onEdgesChange}
				onConnect={onConnect}
				fitView
			/>
		</div>
	);
}
