import { CredentialForm } from "@/components/credentials/CredentialForm";
import { credentialApi } from "@/lib/api";
import { toast } from "sonner"; // or your toast library
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Calendar, Key, Plus, Search, Trash2 } from "lucide-react";
import CredentialDialog from "@/components/credentials/CredentialDialog";

export default function CredentialPage() {
	const [credentials, setCredentials] = useState<any[]>([]);
	const [dialogOpen, setDialogOpen] = useState<boolean>(false);
	const [editDialogOpen, setEditDialogOpen] = useState<boolean>(false);
	const [editCredential, setEditCredential] = useState<any>(null);

	const handleSubmit = async (data: any) => {
		credentialApi
			.create(data)
			.then(() => {
				toast.success("Credential created successfully!");
				setDialogOpen(false);
			})
			.catch((error: any) => {
				toast.error(error.message);
				throw error;
			});
	};
	const onEditClick = async (credentialId: string) => {
		const response = await credentialApi.getOne(credentialId);
		console.log("credential:", response.credential);
		setEditCredential(response.credential);
		setEditDialogOpen(true);
	};

	const handleEditSubmit = async (data: any) => {
		credentialApi
			.update(editCredential._id, data)
			.then(() => {
				toast.success("Credential updated successfully!");
				setEditDialogOpen(false);
			})
			.catch((error: any) => {
				toast.error(error.message);
				throw error;
			});
	};
	const fetchCredentials = async () => {
		const response = await credentialApi.getAll();
		console.log(response);
		setCredentials(response.credentials);
	};
	useEffect(() => {
		fetchCredentials();
	}, [handleEditSubmit, handleSubmit]);

	return (
		<div className="w-full p-4 flex flex-col">
			<div className="flex items-center justify-between">
				<h1 className="text-3xl font-bold">Your Credentials</h1>
				<div className="flex gap-3">
					<div className="relative flex-1 md:w-64">
						<Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
						<input
							type="text"
							placeholder="Search credentials..."
							className="w-full pl-10 pr-4 py-2 bg-white border border-neutral-200 rounded-lg text-sm text-neutral-900 focus:outline-none focus:ring-2 focus:ring-neutral-900/10 transition-all"
						/>
					</div>
					<Button className="flex items-center gap-2 px-4 py-2 bg-neutral-900 hover:bg-neutral-800 text-white text-sm font-semibold rounded-lg transition-colors">
						<Plus className="w-4 h-4" />
						New Credential
					</Button>
				</div>
			</div>
			<div className="space-y-6 mt-8">
				{credentials.length !== 0 ? (
					<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
						{credentials.map((credential) => (
							<div
								key={credential._id}
								className="group relative rounded-xl border border-neutral-200 bg-white p-5 shadow-sm transition-all hover:shadow-md dark:border-neutral-800 dark:bg-neutral-950"
							>
								<div className="flex items-start justify-between">
									<div className="space-y-1">
										<h3 className="font-semibold leading-none tracking-tight text-neutral-900 dark:text-neutral-100">
											{credential.name}
										</h3>
										<span className="inline-flex items-center rounded-full bg-blue-50 px-2 py-0.5 text-xs font-medium text-blue-700 ring-1 ring-inset ring-blue-700/10 dark:bg-blue-900/20 dark:text-blue-400">
											{credential.type}
										</span>
									</div>
									{/* Action Buttons - appear on hover */}
									<div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
										<button className="p-1 hover:text-red-500 transition-colors">
											<Trash2 className="w-4 h-4" />
										</button>
									</div>
								</div>

								<div className="mt-6 flex items-center justify-between text-xs text-neutral-500">
									<div className="flex items-center gap-1">
										<Calendar className="w-3 h-3" />
										<span>
											{new Date(credential.createdAt).toLocaleDateString()}
										</span>
									</div>
									<Button
										variant="link"
										onClick={() => onEditClick(credential._id)}
										className="text-blue-600 hover:underline dark:text-blue-400"
									>
										Edit Details
									</Button>
								</div>
							</div>
						))}

						{/* "Add New" Card styled to match the grid */}
						<Button
							variant="secondary"
							onClick={() => setDialogOpen(true)}
							className="flex h-full min-h-[140px] flex-col items-center justify-center rounded-xl border-2 border-dashed border-neutral-200 p-5 transition-colors hover:border-neutral-300 hover:bg-neutral-50 dark:border-neutral-800 dark:hover:bg-neutral-900"
						>
							<Plus className="mb-2 h-6 w-6 text-neutral-400" />
							<span className="text-sm font-medium text-neutral-600 dark:text-neutral-400">
								Add Credential
							</span>
						</Button>
					</div>
				) : (
					<div className="flex flex-col items-center justify-center rounded-lg border border-dashed p-12 text-center">
						<div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-neutral-100 dark:bg-neutral-900">
							<Key className="h-6 w-6 text-neutral-500" />
						</div>
						<h3 className="mt-4 text-lg font-semibold">No credentials found</h3>
						<p className="mb-6 mt-2 text-sm text-neutral-500">
							Get started by adding your first exchange or API credential.
						</p>
						<Button
							onClick={() => setDialogOpen(true)}
							className="gap-2"
						>
							<Plus className="h-4 w-4" />
							New Credential
						</Button>
					</div>
				)}
			</div>

			<CredentialDialog
				onSubmit={handleSubmit}
				onCancel={() => setDialogOpen(false)}
				open={dialogOpen}
				onOpenChange={setDialogOpen}
				title="Edit Credential"
				description="Edit your API credentials below"
				credential={editCredential}
			/>
			<CredentialDialog
				onSubmit={handleEditSubmit}
				onCancel={() => setEditDialogOpen(false)}
				open={editDialogOpen}
				onOpenChange={setEditDialogOpen}
				title="Edit Credential"
				description="Edit your API credentials below"
				credential={editCredential}
			/>
		</div>
	);
}
