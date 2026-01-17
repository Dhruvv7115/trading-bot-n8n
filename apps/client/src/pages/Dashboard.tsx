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
	MoreVertical,
} from "lucide-react";
import { toast } from "sonner";

interface Workflow {
	id: string;
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
			setWorkflows(data);
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
			setWorkflows(workflows.filter((w) => w.id !== id));
			toast.success("Workflow deleted");
		} catch (error) {
			toast.error("Failed to delete workflow");
		}
	};

	const filteredWorkflows = workflows.filter((w) =>
		w.name.toLowerCase().includes(search.toLowerCase()),
	);

	return (
		<div className="min-h-screen bg-neutral-950 text-white">
			{/* Header */}
			<header className="border-b border-white/10 bg-neutral-900/50 backdrop-blur-xl sticky top-0 z-10">
				<div className="container mx-auto px-6 h-16 flex items-center justify-between">
					<div className="flex items-center gap-2 font-bold text-xl">
						<div className="p-1.5 bg-indigo-600 rounded-lg">
							<Workflow className="w-5 h-5" />
						</div>
						<span>Dashboard</span>
					</div>
					<div className="flex items-center gap-4">
						<button
							onClick={() => {
								localStorage.removeItem("token");
								navigate("/signin");
							}}
							className="text-sm font-medium text-neutral-400 hover:text-white transition-colors"
						>
							Sign Out
						</button>
						<div className="w-8 h-8 rounded-full bg-indigo-500/20 border border-indigo-500/50 flex items-center justify-center text-indigo-400 font-bold text-sm">
							U
						</div>
					</div>
				</div>
			</header>

			<main className="container mx-auto px-6 py-8">
				{/* Actions Bar */}
				<div className="flex flex-col md:flex-row gap-4 justify-between items-start md:items-center mb-8">
					<div>
						<h1 className="text-2xl font-bold mb-1">My Workflows</h1>
						<p className="text-neutral-400 text-sm">
							Manage and monitor your trading strategies
						</p>
					</div>
					<div className="flex gap-3 w-full md:w-auto">
						<div className="relative flex-1 md:w-64">
							<Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-500" />
							<input
								type="text"
								placeholder="Search workflows..."
								className="w-full pl-10 pr-4 py-2 bg-neutral-900 border border-white/10 rounded-lg text-sm text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all"
								value={search}
								onChange={(e) => setSearch(e.target.value)}
							/>
						</div>
						<Link
							to="/workflow/create"
							className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-semibold rounded-lg transition-colors"
						>
							<Plus className="w-4 h-4" />
							New Workflow
						</Link>
					</div>
				</div>

				{/* Content */}
				{loading ? (
					<div className="flex items-center justify-center py-20">
						<Loader2 className="w-8 h-8 text-indigo-500 animate-spin" />
					</div>
				) : filteredWorkflows.length === 0 ? (
					<div className="text-center py-20 border border-dashed border-white/10 rounded-2xl bg-neutral-900/20">
						<div className="w-16 h-16 bg-neutral-900 rounded-full flex items-center justify-center mx-auto mb-4">
							<Workflow className="w-8 h-8 text-neutral-600" />
						</div>
						<h3 className="text-lg font-medium text-white mb-1">
							No workflows yet
						</h3>
						<p className="text-neutral-500 mb-6">
							Create your first trading workflow to get started.
						</p>
						<Link
							to="/workflow/create"
							className="inline-flex items-center gap-2 px-6 py-2.5 bg-white text-neutral-950 font-bold rounded-lg hover:bg-neutral-200 transition-colors"
						>
							<Plus className="w-4 h-4" />
							Create Workflow
						</Link>
					</div>
				) : (
					<div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
						{filteredWorkflows.map((workflow) => (
							<Link
								key={workflow.id}
								to={`/workflow/${workflow.id}`}
								className="group block p-5 rounded-xl bg-neutral-900 border border-white/5 hover:border-indigo-500/50 hover:bg-neutral-900/80 transition-all"
							>
								<div className="flex justify-between items-start mb-4">
									<div
										className={`w-10 h-10 rounded-lg flex items-center justify-center ${workflow.active ? "bg-emerald-500/10 text-emerald-500" : "bg-neutral-800 text-neutral-400"}`}
									>
										<Workflow className="w-5 h-5" />
									</div>
									<button
										onClick={(e) => handleDelete(e, workflow.id)}
										className="p-2 text-neutral-500 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors opacity-0 group-hover:opacity-100"
									>
										<Trash2 className="w-4 h-4" />
									</button>
								</div>

								<h3 className="text-lg font-semibold text-white mb-1 group-hover:text-indigo-400 transition-colors">
									{workflow.name}
								</h3>
								<p className="text-sm text-neutral-400 line-clamp-2 mb-4 h-10">
									{workflow.description || "No description provided."}
								</p>

								<div className="flex items-center gap-4 text-xs text-neutral-500 border-t border-white/5 pt-4">
									<div className="flex items-center gap-1.5">
										<div
											className={`w-1.5 h-1.5 rounded-full ${workflow.active ? "bg-emerald-500" : "bg-neutral-600"}`}
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
