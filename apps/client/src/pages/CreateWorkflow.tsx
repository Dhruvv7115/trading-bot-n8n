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
	type FinalConnectionState,
	type XYPosition,
} from "@xyflow/react";
import { toast } from "sonner";
import "@xyflow/react/dist/style.css";
import TriggerSheet from "@/components/TriggerSheet";
import Time from "@/components/nodes/triggers/Time";
import Price from "@/components/nodes/triggers/Price";
import type { TriggerType, TriggerMetaData } from "common/types";
import type { ActionType, TradingMetaData } from "common/types";
import ActionSheet from "@/components/ActionSheet";
import Hyperliquid from "@/components/nodes/actions/Hyperliquid";
import Lighter from "@/components/nodes/actions/Lighter";
import Backpack from "@/components/nodes/actions/Backpack";

interface NodeType {
	id: string;
	position: { x: number; y: number };
	type: TriggerType | ActionType;
	data: {
		metaData: TriggerMetaData | TradingMetaData;
		label: string;
	};
}

const nodeTypes = {
	time: Time,
	price: Price,
	hyperliquid: Hyperliquid,
	lighter: Lighter,
	backpack: Backpack,
};

export default function CreateWorkflowPage() {
	const [nodes, setNodes] = useState<NodeType[]>([]);
	const [edges, setEdges] = useState<Edge[]>([]);
	const [selectAction, setSelectAction] = useState<{
		startingNodeId: string | undefined;
		position: {
			x: number;
			y: number;
		} | null;
	} | null>(null);

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

	const onTriggerSelect = (trigger: TriggerType, metaData: TriggerMetaData) => {
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
	const onActionSelect = (action: ActionType, metaData: TradingMetaData) => {
		if (!metaData.type) {
			toast.error("Please enter the type of trade");
			return;
		}
		if (!metaData.symbol) {
			toast.error("Please enter the symbol");
			return;
		}
		if (!metaData.quantity) {
			toast.error("Please enter the quantity of the symbol");
			return;
		}
		const newNode = {
			id: `${action}-${nodes.length + 1}`,
			position: selectAction?.position as { x: number; y: number },
			type: action,
			data: {
				metaData,
				label: action.charAt(0).toUpperCase() + action.slice(1),
			},
		};
		setNodes([...nodes, newNode]);
		setEdges([
			...edges,
			{
				id: `${selectAction?.startingNodeId}-${newNode.id}`,
				source: `${selectAction?.startingNodeId}`,
				target: `${newNode.id}`,
			},
		]);
		setSelectAction(null);
	};
	const onConnectEnd = useCallback(
		(_: MouseEvent | TouchEvent, connectionState: FinalConnectionState) => {
			// when a connection is dropped on the pane it's not valid
			if (!connectionState.isValid) {
				// we need to remove the wrapper bounds, in order to get the correct position
				setSelectAction({
					position: connectionState.from,
					startingNodeId: connectionState.fromNode?.id,
				});
			}
		},
		[],
	);
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
			{selectAction && (
				<ActionSheet
					onActionSelect={(action, metaData) =>
						onActionSelect(action, metaData)
					}
				/>
			)}
			<ReactFlow
				onConnectEnd={onConnectEnd}
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
