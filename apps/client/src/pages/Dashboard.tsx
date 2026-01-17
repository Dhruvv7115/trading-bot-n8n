import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { workflowApi } from "../lib/api";
import {
	Plus,
	Search,
	Loader2,
	Workflow,
	Trash2,
	Calendar,
	GitFork,
} from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";

interface Workflow {
	_id: string;
	name: string;
	description?: string;
	active?: boolean;
	createdAt: string;
}

export default function Dashboard() {
	const navigate = useNavigate();
	const [workflows, setWorkflows] = useState<Workflow[]>([]);
	const [loading, setLoading] = useState(true);
	const [search, setSearch] = useState("");

	useEffect(() => {
		loadWorkflows();
	}, []);

	const loadWorkflows = async () => {
		try {
			const data = await workflowApi.getAll();
			setWorkflows(data.workflows);
		} catch (error) {
			toast.error("Failed to load workflows");
		} finally {
			setLoading(false);
		}
	};

	const handleDelete = async (e: React.MouseEvent, id: string) => {
		e.preventDefault();
		if (!confirm("Are you sure you want to delete this workflow?")) return;

		try {
			await workflowApi.delete(id);
			setWorkflows(workflows.filter((w) => w._id !== id));
			toast.success("Workflow deleted");
		} catch (error) {
			toast.error("Failed to delete workflow");
		}
	};

	const filteredWorkflows = workflows.filter((w) =>
		w.name.toLowerCase().includes(search.toLowerCase()),
	);

	return (
		<div className="min-h-screen bg-neutral-50 text-neutral-900">
			<main className="container mx-auto px-6 py-8">
				{/* Actions Bar */}
				<div className="flex flex-col md:flex-row gap-4 justify-between items-start md:items-center mb-8">
					<div>
						<h1 className="text-2xl font-bold mb-1 text-neutral-900">
							My Workflows
						</h1>
						<p className="text-neutral-500 text-sm">
							Manage and monitor your trading strategies
						</p>
					</div>
					<div className="flex gap-3 w-full md:w-auto">
						<div className="relative flex-1 md:w-64">
							<Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
							<input
								type="text"
								placeholder="Search workflows..."
								className="w-full pl-10 pr-4 py-2 bg-white border border-neutral-200 rounded-lg text-sm text-neutral-900 focus:outline-none focus:ring-2 focus:ring-neutral-900/10 transition-all"
								value={search}
								onChange={(e) => setSearch(e.target.value)}
							/>
						</div>
						<Link
							to="/workflow/create"
							className="flex items-center gap-2 px-4 py-2 bg-neutral-900 hover:bg-neutral-800 text-white text-sm font-semibold rounded-lg transition-colors"
						>
							<Plus className="w-4 h-4" />
							New Workflow
						</Link>
					</div>
				</div>

				{/* Content */}
				{loading ? (
					<div className="flex items-center justify-center py-20">
						<Loader2 className="w-8 h-8 text-neutral-400 animate-spin" />
					</div>
				) : filteredWorkflows.length === 0 ? (
					<div className="text-center py-20 border border-dashed border-neutral-200 rounded-2xl bg-white/50">
						<div className="w-16 h-16 bg-neutral-100 rounded-full flex items-center justify-center mx-auto mb-4">
							<Workflow className="w-8 h-8 text-neutral-400" />
						</div>
						<h3 className="text-lg font-medium text-neutral-900 mb-1">
							No workflows yet
						</h3>
						<p className="text-neutral-500 mb-6">
							Create your first trading workflow to get started.
						</p>
						<Link
							to="/workflow/create"
							className="inline-flex items-center gap-2 px-6 py-2.5 bg-neutral-900 text-white font-bold rounded-lg hover:bg-neutral-800 transition-colors"
						>
							<Plus className="w-4 h-4" />
							Create Workflow
						</Link>
					</div>
				) : (
					<div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
						{filteredWorkflows.map((workflow) => (
							<Link
								key={workflow._id}
								to={`/workflow/${workflow._id}`}
								className="group block p-5 rounded-xl bg-white border border-neutral-200 hover:border-neutral-300 hover:shadow-sm transition-all"
							>
								<div className="flex justify-between items-start mb-4">
									<div
										className={`w-10 h-10 rounded-lg flex items-center justify-center rotate-90 ${workflow.active ? "bg-neutral-900 text-white" : "bg-neutral-100 text-neutral-400"}`}
									>
										<GitFork className="w-5 h-5" />
									</div>
									<Button
										onClick={(e) => handleDelete(e, workflow._id)}
										variant="ghost"
										size="sm"
										className="text-neutral-400 hover:text-red-600 hover:bg-red-50"
									>
										<Trash2 className="w-4 h-4" />
									</Button>
								</div>

								<h3 className="text-lg font-semibold text-neutral-900 mb-1 group-hover:text-neutral-700 transition-colors">
									{workflow.name}
								</h3>
								<p className="text-sm text-neutral-500 line-clamp-2 mb-4 h-10">
									{workflow.description || "No description provided."}
								</p>

								<div className="flex items-center gap-4 text-xs text-neutral-500 border-t border-neutral-100 pt-4">
									<div className="flex items-center gap-1.5">
										<div
											className={`w-1.5 h-1.5 rounded-full ${workflow.active ? "bg-neutral-900" : "bg-neutral-300"}`}
										/>
										{workflow.active ? "Active" : "Inactive"}
									</div>
									<div className="flex items-center gap-1.5 ml-auto">
										<Calendar className="w-3 h-3" />
										{new Date().toLocaleDateString()}
									</div>
								</div>
							</Link>
						))}
					</div>
				)}
			</main>
		</div>
	);
}
