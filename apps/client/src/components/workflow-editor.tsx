import { useState, useCallback, useEffect } from "react";
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
	BackgroundVariant,
	Background,
	BezierEdge,
	MarkerType,
} from "@xyflow/react";
import { toast } from "sonner";
import "@xyflow/react/dist/style.css";
import TriggerSheet from "@/components/trigger-sheet";
import Time from "@/components/nodes/triggers/Time";
import Price from "@/components/nodes/triggers/Price";
import type { TriggerType, TriggerMetaData } from "common/types";
import type { ActionType, TradingMetaData } from "common/types";
import ActionSheet from "@/components/action-sheet";
import Hyperliquid from "@/components/nodes/actions/Hyperliquid";
import Lighter from "@/components/nodes/actions/Lighter";
import Backpack from "@/components/nodes/actions/Backpack";
import { type NodeType } from "common/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Save, ArrowLeft, Loader2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { CustomEdge } from "./custom-edge";

const nodeTypes = {
	time: Time,
	price: Price,
	hyperliquid: Hyperliquid,
	lighter: Lighter,
	backpack: Backpack,
};

const edgeTypes = {
	custom: CustomEdge,
};	

interface WorkflowEditorProps {
	workflowId?: string;
	initialNodes?: NodeType[];
	initialEdges?: Edge[];
	initialName?: string;
	onSave: (name: string, nodes: NodeType[], edges: Edge[]) => Promise<void>;
	isSaving?: boolean;
}

export default function WorkflowEditor({
	workflowId,
	initialNodes = [],
	initialEdges = [],
	initialName = "",
	onSave,
	isSaving = false,
}: WorkflowEditorProps) {
	const navigate = useNavigate();
	const [nodes, setNodes] = useState<NodeType[]>(initialNodes);
	const [edges, setEdges] = useState<Edge[]>(initialEdges);
	const [workflowName, setWorkflowName] = useState(initialName);
	const [isSaveDialogOpen, setIsSaveDialogOpen] = useState(false);
	const [selectAction, setSelectAction] = useState<{
		startingNodeId: string | undefined;
		position: {
			x: number;
			y: number;
		} | null;
	} | null>(null);

	// Update local state when props change (e.g. after fetching data)
	useEffect(() => {
		if (initialNodes.length > 0) setNodes(initialNodes);
		if (initialEdges.length > 0) setEdges(initialEdges);
		if (initialName) setWorkflowName(initialName);
		console.log("edges", edges);
	}, [initialNodes, initialEdges, initialName]);

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
				title: trigger.charAt(0).toUpperCase() + trigger.slice(1),
				description: `${metaData.type} ${metaData.asset}`,
				data: {
					kind: "TRIGGER",
					metaData: metaData,
				},
			},
		]);
	};
	const onActionSelect = async (
		action: ActionType,
		metaData: TradingMetaData,
		credentialId: string,
	) => {
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
		const newNode: NodeType = {
			id: `${action}-${nodes.length + 1}`,
			position: selectAction?.position as { x: number; y: number },
			type: action,
			title: action.charAt(0).toUpperCase() + action.slice(1),
			description: `${metaData.type} ${metaData.symbol}`,
			data: {
				metaData,
				kind: "ACTION",
			},
			credentialId: credentialId,
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
			if (!connectionState.isValid) {
				setSelectAction({
					position: connectionState.from,
					startingNodeId: connectionState.fromNode?.id,
				});
			}
		},
		[],
	);

	const handleSaveClick = () => {
		if (!workflowName && !initialName) {
			setIsSaveDialogOpen(true);
		} else {
			onSave(workflowName || "Untitled Workflow", nodes, edges);
		}
	};

	const handleDialogSave = () => {
		if (!workflowName) {
			toast.error("Please enter a workflow name");
			return;
		}
		setIsSaveDialogOpen(false);
		onSave(workflowName, nodes, edges);
	};

	return (
		<div className="flex flex-col w-full h-screen bg-neutral-50 py-2 px-6">
			{/* Navbar Overlay */}
			<div className="flex items-center justify-between mb-4">
				<div>
					<Button
						variant="outline"
						className="bg-white border-neutral-200 hover:bg-neutral-100 text-neutral-900 gap-2"
						onClick={() => navigate("/dashboard")}
					>
						<ArrowLeft className="w-4 h-4" />
						Back
					</Button>
				</div>
				<div className="flex bg-white/50 backdrop-blur-md p-1 rounded-lg border border-neutral-200">
					<Input
						value={workflowName}
						onChange={(e) => setWorkflowName(e.target.value)}
						placeholder="Workflow Name"
						className="border-none bg-transparent focus-visible:ring-0 w-64 text-center font-medium placeholder:text-neutral-400"
					/>
				</div>
				<div className="flex items-center gap-2">
					<Button
						onClick={() => {
							navigate(`/workflow/${workflowId}/executions`);
						}}
						variant="outline"
						className="bg-white border-neutral-200 hover:bg-neutral-100 text-neutral-900 gap-2"
					>
						View Executions
					</Button>
					<Button
						onClick={handleSaveClick}
						disabled={isSaving}
						className="bg-neutral-900 text-white hover:bg-neutral-800 gap-2 shadow-sm"
					>
						{isSaving ? (
							<Loader2 className="w-4 h-4 animate-spin" />
						) : (
							<Save className="w-4 h-4" />
						)}
						Save Workflow
					</Button>
				</div>
			</div>

			{/* Flow Canvas */}
			<div className="flex-1 border-2 border-neutral-200 rounded-xl overflow-hidden bg-neutral-100 mb-4">
				<ReactFlow
					nodes={nodes}
					edges={edges}
					nodeTypes={nodeTypes}
					edgeTypes={edgeTypes}
					onNodesChange={onNodesChange}
					onEdgesChange={onEdgesChange}
					onConnect={onConnect}
					onConnectEnd={onConnectEnd}
					fitView
					className="bg-neutral-50"
				>
					{/* Background or other controls could go here */}
					<Background
						color="#ccc"
						size={2}
						variant={BackgroundVariant.Dots}
					/>
				</ReactFlow>
			</div>

			{/* Sheets */}
			{nodes.length === 0 && (
				<TriggerSheet
					onTriggerSelect={(trigger, metaData) =>
						onTriggerSelect(trigger, metaData)
					}
				/>
			)}
			{selectAction && (
				<ActionSheet
					onActionSelect={(action, metaData, credentialId) =>
						onActionSelect(action, metaData, credentialId)
					}
				/>
			)}

			{/* Save Dialog for New Workflows */}
			<Dialog
				open={isSaveDialogOpen}
				onOpenChange={setIsSaveDialogOpen}
			>
				<DialogContent className="sm:max-w-[425px]">
					<DialogHeader>
						<DialogTitle>Save Workflow</DialogTitle>
						<DialogDescription>
							Give your workflow a name to save it.
						</DialogDescription>
					</DialogHeader>
					<div className="grid gap-4 py-4">
						<div className="grid grid-cols-4 items-center gap-4">
							<Label
								htmlFor="name"
								className="text-right"
							>
								Name
							</Label>
							<Input
								id="name"
								value={workflowName}
								onChange={(e) => setWorkflowName(e.target.value)}
								className="col-span-3"
								placeholder="My Trading Bot"
							/>
						</div>
					</div>
					<DialogFooter>
						<Button onClick={handleDialogSave}>Save changes</Button>
					</DialogFooter>
				</DialogContent>
			</Dialog>
		</div>
	);
}
