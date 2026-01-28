import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import { CredentialForm } from "./CredentialForm";
interface CredentialDialogProps {
	onSubmit: (data: any) => Promise<void>;
	onCancel: () => void;
	open: boolean;
	onOpenChange: (open: boolean) => void;
	title: string;
	description: string;
	credential?: any;
}
function CredentialDialog({
	onSubmit,
	onCancel,
	open,
	onOpenChange,
	title = "Add a new credential",
	description = "Add your API credentials below",
	credential,
}: CredentialDialogProps) {
	return (
		<Dialog
			open={open}
			onOpenChange={onOpenChange}
		>
			<DialogContent>
				<DialogHeader>
					<DialogTitle>{title}</DialogTitle>
					<DialogDescription>{description}</DialogDescription>
				</DialogHeader>
				<CredentialForm
					onSubmit={onSubmit}
					onCancel={onCancel}
					credential={credential}
				/>
			</DialogContent>
		</Dialog>
	);
}

export default CredentialDialog;
