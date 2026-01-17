import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { toast } from "sonner";
import WorkflowEditor from "@/components/workflow-editor";
import { workflowApi, nodeApi, edgeApi } from "@/lib/api";
import { type NodeType } from "common/types";
import { type Edge } from "@xyflow/react";

export default function EditWorkflowPage() {
	const { id } = useParams<{ id: string }>();
	const [loading, setLoading] = useState(true);
	const [isSaving, setIsSaving] = useState(false);
	const [workflowName, setWorkflowName] = useState("");
	const [nodes, setNodes] = useState<NodeType[]>([]);
	const [edges, setEdges] = useState<Edge[]>([]);

	// Keep track of original IDs to know what to delete
	const [originalNodeIds, setOriginalNodeIds] = useState<Set<string>>(
		new Set(),
	);
	const [originalEdgeIds, setOriginalEdgeIds] = useState<Set<string>>(
		new Set(),
	);

	useEffect(() => {
		if (!id) return;
		loadData();
	}, [id]);

	const loadData = async () => {
		if (!id) return;
		try {
			setLoading(true);
			const [workflow, fetchedNodes, fetchedEdges] = await Promise.all([
				workflowApi.getById(id),
				nodeApi.getAll(id),
				edgeApi.getAll(id), // Assuming edgeApi.getAll exists, if not need to add it
			]);

			if (workflow) {
				setWorkflowName(workflow.name);
			}

			if (fetchedNodes) {
				const n = fetchedNodes.nodes || fetchedNodes; // Adjust based on API structure
				setNodes(n);
				setOriginalNodeIds(new Set(n.map((node: NodeType) => node.id)));
			}

			if (fetchedEdges) {
				const e = fetchedEdges.edges || fetchedEdges; // Adjust based on API structure
				const formattedEdges = e.map((edge: any) => ({
					...edge,
					id: edge.id, // Ensure ID matches
				}));
				setEdges(formattedEdges);
				setOriginalEdgeIds(new Set(formattedEdges.map((edge: any) => edge.id)));
			}
		} catch (error) {
			console.error("Failed to load workflow data", error);
			toast.error("Failed to load workflow data");
		} finally {
			setLoading(false);
		}
	};

	const handleSave = async (
		name: string,
		currentNodes: NodeType[],
		currentEdges: Edge[],
	) => {
		if (!id) return;
		setIsSaving(true);
		try {
			// 1. Update Workflow Details
			await workflowApi.update(id, { name });

			// 2. Sync Nodes
			const currentNodeIds = new Set(currentNodes.map((n) => n.id));

			// Delete removed nodes
			const nodesToDelete = Array.from(originalNodeIds).filter(
				(nodeId) => !currentNodeIds.has(nodeId),
			);
			await Promise.all(
				nodesToDelete.map((nodeId) => nodeApi.delete(id, nodeId)),
			);

			// Create or Update nodes
			const nodePromises = currentNodes.map((node) => {
				if (originalNodeIds.has(node.id)) {
					// Update
					// @ts-ignore
					return nodeApi.update(id, node.id, node);
				} else {
					// Create
					// @ts-ignore
					return nodeApi.create(id, node);
				}
			});
			await Promise.all(nodePromises);

			// 3. Sync Edges
			// NOTE: edgeApi typically might not have update, only create/delete.
			// If edgeApi.update exists use it, otherwise delete all and recreate is safer for edges since they are lightweight links.
			// Checking edge.ts in step 215: it DOES NOT have update. Only create and delete.
			// So for edges, we delete all original and create all new. Or diff carefully.
			// Simpler to strict diff:
			const currentEdgeIds = new Set(currentEdges.map((e) => e.id));
			const edgesToDelete = Array.from(originalEdgeIds).filter(
				(edgeId) => !currentEdgeIds.has(edgeId),
			);
			const edgesToCreate = currentEdges.filter(
				(e) => !originalEdgeIds.has(e.id),
			);

			// We don't update edges usually, just delete/create
			await Promise.all(
				edgesToDelete.map((edgeId) => edgeApi.delete(id, edgeId)),
			);
			await Promise.all(
				edgesToCreate.map((edge) =>
					edgeApi.create(id, {
						id: edge.id,
						source: edge.source,
						target: edge.target,
					}),
				),
			);

			toast.success("Workflow saved successfully");

			// Refresh data to reset original sets
			await loadData();
		} catch (error: any) {
			console.error(error);
			toast.error(error.message || "Failed to save workflow");
		} finally {
			setIsSaving(false);
		}
	};

	if (loading) {
		return (
			<div className="flex items-center justify-center min-h-screen bg-neutral-50">
				<div className="animate-spin w-8 h-8 border-4 border-neutral-900 border-t-transparent rounded-full" />
			</div>
		);
	}

	return (
		<WorkflowEditor
			initialNodes={nodes}
			initialEdges={edges}
			initialName={workflowName}
			onSave={handleSave}
			isSaving={isSaving}
		/>
	);
}
