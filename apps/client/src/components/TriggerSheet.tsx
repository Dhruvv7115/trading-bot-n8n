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
import { useEffect, useState } from "react";
import {
	TRIGGER_CONFIGS,
	SUPPORTED_TRIGGERS,
} from "common/configs";
import PriceMetaData from "./nodes/triggers/trigger-metadata/PriceMetaData";
import TimeMetaData from "./nodes/triggers/trigger-metadata/TimeMetaData";
import type {
	PriceNodeMetaData,
	TimeNodeMetaData,
	TriggerMetaData,
	TriggerType,
} from "common/types";

export default function TriggerSheet({
	onTriggerSelect,
}: {
	onTriggerSelect: (trigger: TriggerType, metaData: TriggerMetaData) => void;
}) {
	const [selectedTrigger, setSelectedTrigger] = useState<TriggerType>("time");
	const [metaData, setMetaData] = useState<TriggerMetaData>(
		TRIGGER_CONFIGS.time.defaultMetaData,
	);
	useEffect(() => {
		// Automatically get the right default metadata
		setMetaData(TRIGGER_CONFIGS[selectedTrigger]?.defaultMetaData);
	}, [selectedTrigger]);
	return (
		<Sheet open>
			{/* <SheetTrigger asChild>
				<Button
					variant="outline"
					size="icon-lg"
					className="p-16 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-1"
				>
					<IconPlus className="size-20 text-neutral-500" />
				</Button>
			</SheetTrigger> */}
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
								{TRIGGER_CONFIGS[selectedTrigger]?.title}
							</SelectValue>
						</SelectTrigger>
						<SelectContent>
							<SelectGroup>
								{SUPPORTED_TRIGGERS.map(({ id, title, description }) => (
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
					{selectedTrigger === "time" && (
						<TimeMetaData
							metaData={metaData as TimeNodeMetaData}
							setMetaData={setMetaData}
						/>
					)}
					{selectedTrigger === "price" && (
						<PriceMetaData
							metaData={metaData as PriceNodeMetaData}
							setMetaData={setMetaData}
						/>
					)}
					{/* {selectedTrigger === "volume" && (
						<VolumeMetaData
							metaData={metaData}
							setMetaData={setMetaData}
						/>
					)} */}
				</div>
				<SheetFooter>
					<Button
						type="submit"
						onClick={() => {
							onTriggerSelect(selectedTrigger, metaData);
						}}
					>
						Create Trigger
					</Button>
				</SheetFooter>
			</SheetContent>
		</Sheet>
	);
}
