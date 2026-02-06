import { credentialApi } from "@/lib/api";
import { toast } from "sonner"; // or your toast library
import { useCallback, useState } from "react";
import { Button } from "@/components/ui/button";
import { Calendar, Key, Plus, Search, Trash2 } from "lucide-react";
import CredentialDialog from "@/components/credentials/CredentialDialog";
import useCredentials from "@/hooks/use-credentials";

export default function CredentialPage() {
	const [dialogOpen, setDialogOpen] = useState<boolean>(false);
	const [editDialogOpen, setEditDialogOpen] = useState<boolean>(false);
	const [editCredential, setEditCredential] = useState<any>(null);

	const handleSubmit = useCallback((data: any) => {
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
	}, []);
	const onEditClick = async (credentialId: string) => {
		const response = await credentialApi.getOne(credentialId);
		setEditCredential(response.credential);
		setEditDialogOpen(true);
	};

	const handleEditSubmit = useCallback(async (data: any) => {
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
	}, []);

	const { credentials } = useCredentials([handleSubmit, handleEditSubmit]);

	return (
		<div className="min-h-screen bg-background text-foreground">
			<main className="container mx-auto px-6 py-8">
				<div className="flex flex-col md:flex-row gap-4 justify-between items-start md:items-center mb-8">
					<div>
						<h1 className="text-2xl font-bold mb-1 tracking-tight">
							Your Credentials
						</h1>
						<p className="text-muted-foreground text-sm">
							Manage and monitor your API credentials
						</p>
					</div>
					<div className="flex gap-3">
						<div className="relative flex-1 md:w-64">
							<Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
							<input
								type="text"
								placeholder="Search credentials..."
								className="w-full pl-10 pr-4 py-2 bg-background border border-border rounded-lg text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring/20 transition-all"
							/>
						</div>
						<Button
							className="flex items-center gap-2 px-4 py-2 bg-primary hover:bg-primary/90 text-primary-foreground text-sm font-medium rounded-lg transition-colors"
							onClick={() => setDialogOpen(true)}
						>
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
									className="group relative rounded-xl border border-border bg-card p-5 shadow-sm transition-all hover:shadow-md hover:border-ring/50"
								>
									<div className="flex items-start justify-between">
										<div className="space-y-1">
											<h3 className="font-semibold leading-none tracking-tight text-card-foreground">
												{credential.name}
											</h3>
											<span className="inline-flex items-center rounded-full bg-secondary px-2 py-0.5 text-xs font-medium text-secondary-foreground">
												{credential.type}
											</span>
										</div>
										{/* Action Buttons - appear on hover */}
										<div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
											<button className="p-1 hover:text-destructive transition-colors text-muted-foreground">
												<Trash2 className="w-4 h-4" />
											</button>
										</div>
									</div>

									<div className="mt-6 flex items-center justify-between text-xs text-muted-foreground">
										<div className="flex items-center gap-1">
											<Calendar className="w-3 h-3" />
											<span>
												{new Date(credential.createdAt).toLocaleDateString()}
											</span>
										</div>
										<Button
											variant="link"
											onClick={() => onEditClick(credential._id)}
											className="text-primary hover:text-primary/80 h-auto p-0"
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
								className="flex h-full min-h-[140px] flex-col items-center justify-center rounded-xl border-2 border-dashed border-border bg-transparent p-5 transition-colors hover:border-primary/50 hover:bg-accent/50 text-muted-foreground hover:text-foreground"
							>
								<Plus className="mb-2 h-6 w-6" />
								<span className="text-sm font-medium">Add Credential</span>
							</Button>
						</div>
					) : (
						<div className="flex flex-col items-center justify-center rounded-lg border border-dashed border-border p-12 text-center bg-card/50">
							<div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-secondary">
								<Key className="h-6 w-6 text-muted-foreground" />
							</div>
							<h3 className="mt-4 text-lg font-semibold text-foreground">
								No credentials found
							</h3>
							<p className="mb-6 mt-2 text-sm text-muted-foreground">
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

				{dialogOpen && (
					<CredentialDialog
						type="Create"
						onSubmit={handleSubmit}
						onCancel={() => setDialogOpen(false)}
						open={dialogOpen}
						onOpenChange={setDialogOpen}
						title="Create Credential"
						description="Create a new API credential"
						credential={editCredential}
					/>
				)}
				{editDialogOpen && (
					<CredentialDialog
						type="Update"
						onSubmit={handleEditSubmit}
						onCancel={() => setEditDialogOpen(false)}
						open={editDialogOpen}
						onOpenChange={setEditDialogOpen}
						title="Edit Credential"
						description="Edit your API credentials below"
						credential={editCredential}
					/>
				)}
			</main>
		</div>
	);
}
