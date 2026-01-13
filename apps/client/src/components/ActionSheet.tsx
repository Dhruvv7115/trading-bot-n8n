import { Button } from "@/components/ui/button";
import {
	Sheet,
	SheetContent,
	SheetDescription,
	SheetFooter,
	SheetHeader,
	SheetTitle,
} from "@/components/ui/sheet";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
	SelectGroup,
} from "@/components/ui/select";
import { useState } from "react";
import { SUPPORTED_ACTIONS } from "@/configs/actions.config";
import type { ActionType, TradingMetaData } from "@/types/actions.types";
import ExchangeMetaData from "./nodes/actions/action-metadata/ExchangeMetaData";

export default function ActionSheet({
	onActionSelect,
}: {
	onActionSelect: (action: ActionType, metaData: TradingMetaData) => void;
}) {
	const [selectedAction, setSelectedAction] = useState<ActionType>(
		SUPPORTED_ACTIONS[0].id,
	);
	const [metaData, setMetaData] = useState<TradingMetaData | {}>({});
	return (
		<Sheet open>
			<SheetContent>
				<SheetHeader>
					<SheetTitle>Select Action Type</SheetTitle>
					<SheetDescription>
						Select the type of action you want to create.
					</SheetDescription>
				</SheetHeader>
				<div className="grid flex-1 auto-rows-min gap-12 px-4">
					<Select
						value={selectedAction}
						defaultValue="time"
						onValueChange={(value: ActionType) => {
							setSelectedAction(value);
						}}
					>
						<SelectTrigger className="w-full">
							<SelectValue placeholder="Select a Action">
								{selectedAction.charAt(0).toUpperCase() +
									selectedAction.slice(1)}
							</SelectValue>
						</SelectTrigger>
						<SelectContent>
							<SelectGroup>
								{SUPPORTED_ACTIONS.map(({ id, title, description }) => (
									<SelectItem
										key={id}
										value={id}
									>
										<div className="flex-row gap-2">
											<div>{title}</div>
											<div className="text-xs text-muted-foreground">
												{description}
											</div>
										</div>
									</SelectItem>
								))}
							</SelectGroup>
						</SelectContent>
					</Select>
					{(selectedAction === "hyperliquid" ||
						selectedAction === "lighter" ||
						selectedAction === "backpack") && (
						<ExchangeMetaData
							metaData={metaData as TradingMetaData}
							setMetaData={setMetaData}
						/>
					)}
				</div>
				<SheetFooter>
					<Button
						type="submit"
						onClick={() => {
							onActionSelect(selectedAction, metaData as TradingMetaData);
						}}
					>
						Create Action
					</Button>
				</SheetFooter>
			</SheetContent>
		</Sheet>
	);
}
