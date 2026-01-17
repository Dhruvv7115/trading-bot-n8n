import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import WorkflowEditor from "@/components/workflow-editor";
import { workflowApi, nodeApi, edgeApi } from "@/lib/api";
import { type NodeType } from "common/types";
import { type Edge } from "@xyflow/react";

export default function CreateWorkflowPage() {
	const navigate = useNavigate();
	const [isSaving, setIsSaving] = useState(false);

	const handleSave = async (name: string, nodes: NodeType[], edges: Edge[]) => {
		setIsSaving(true);
		try {
			// 1. Create Workflow
			const workflow = await workflowApi.create({
				name,
				active: false,
			});

			if (!workflow || !workflow.id) {
				throw new Error("Failed to create workflow");
			}

			// 2. Create Nodes
			// We map over nodes and create them one by one or in parallel
			// Note: ensure nodeApi.create expects the structure of NodeType
			const nodePromises = nodes.map((node) =>
				nodeApi.create(workflow.id, node),
			);
			await Promise.all(nodePromises);

			// 3. Create Edges
			// Note: ensure edgeApi.create expects the structure of Edge (id, source, target)
			const edgePromises = edges.map((edge) =>
				edgeApi.create(workflow.id, {
					id: edge.id,
					source: edge.source,
					target: edge.target,
				}),
			);
			await Promise.all(edgePromises);

			toast.success("Workflow created successfully!");
			navigate(`/workflow/${workflow.id}`);
		} catch (error: any) {
			console.error(error);
			toast.error(error.message || "Failed to create workflow");
		} finally {
			setIsSaving(false);
		}
	};

	return (
		<WorkflowEditor
			onSave={handleSave}
			isSaving={isSaving}
		/>
	);
}
