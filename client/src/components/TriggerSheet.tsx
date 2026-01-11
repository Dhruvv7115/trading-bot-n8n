import { Button } from "@/components/ui/button";
import {
	Sheet,
	SheetContent,
	SheetDescription,
	SheetFooter,
	SheetHeader,
	SheetTitle,
	SheetTrigger,
} from "@/components/ui/sheet";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
	SelectGroup,
} from "@/components/ui/select";
import { IconPlus } from "@tabler/icons-react";
import { useState } from "react";
import type { MetaData, TriggerType } from "@/pages/CreateWorkflow";
import PriceMetaData from "./trigger-metadata/PriceMetaData";
import TimeMetaData from "./trigger-metadata/TimeMetaData";

const SUPPORTED_TRIGGERS = [
	{
		id: "time",
		title: "Time Trigger",
		description: "Triggers every time a certain amount of time has passed.",
	},
	{
		id: "price",
		title: "Price Trigger",
		description:
			"Triggers when the price of a certain asset reaches a certain value.",
	},
];

export default function TriggerSheet({
	onTriggerSelect,
}: {
	onTriggerSelect: (trigger: TriggerType, metaData: MetaData) => void;
}) {
	const [selectedTrigger, setSelectedTrigger] = useState<TriggerType>("time");
	const [metaData, setMetaData] = useState<MetaData>({
		time: 60,
		asset: "SOL",
		action: "buy",
	});

	return (
		<Sheet>
			<SheetTrigger asChild>
				<Button
					variant="outline"
					size="icon-lg"
					className="p-16 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-1"
				>
					<IconPlus className="size-20 text-neutral-500" />
				</Button>
			</SheetTrigger>
			<SheetContent>
				<SheetHeader>
					<SheetTitle>Select Trigger Type</SheetTitle>
					<SheetDescription>
						Select the type of trigger you want to create.
					</SheetDescription>
				</SheetHeader>
				<div className="grid flex-1 auto-rows-min gap-12 px-4">
					<Select
						value={selectedTrigger}
						defaultValue="time"
						onValueChange={(value: TriggerType) => setSelectedTrigger(value)}
					>
						<SelectTrigger className="w-full">
							<SelectValue placeholder="Select a trigger">
								{selectedTrigger
									? SUPPORTED_TRIGGERS.find((t) => t.id === selectedTrigger)
											?.title
									: null}
							</SelectValue>
						</SelectTrigger>
						<SelectContent>
							<SelectGroup>
								{SUPPORTED_TRIGGERS.map(({ id, title, description }) => (
									<SelectItem
										key={id}
										value={id}
										className="flex-row gap-2"
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
					{selectedTrigger === "time" && (
						<TimeMetaData
							metaData={metaData}
							setMetaData={setMetaData}
						/>
					)}
					{selectedTrigger === "price" && (
						<PriceMetaData
							metaData={metaData}
							setMetaData={setMetaData}
						/>
					)}
				</div>
				<SheetFooter>
					<Button
						type="submit"
						onClick={() => onTriggerSelect(selectedTrigger, metaData)}
					>
						Create Trigger
					</Button>
				</SheetFooter>
			</SheetContent>
		</Sheet>
	);
}
