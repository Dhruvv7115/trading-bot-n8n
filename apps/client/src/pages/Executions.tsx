import {
	CheckCircle2,
	XCircle,
	Clock,
	PlayCircle,
	AlertCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { executionApi } from "@/lib/api";
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

// Helper function to get status styling
const getStatusConfig = (status: string) => {
	switch (status.toUpperCase()) {
		case "SUCCESS":
			return {
				icon: CheckCircle2,
				bgColor: "bg-green-50",
				textColor: "text-green-700",
				borderColor: "border-green-200",
				label: "Success",
			};
		case "FAILURE":
		case "ERROR":
			return {
				icon: XCircle,
				bgColor: "bg-red-50",
				textColor: "text-red-700",
				borderColor: "border-red-200",
				label: "Failed",
			};
		case "PENDING":
		case "RUNNING":
			return {
				icon: Clock,
				bgColor: "bg-blue-50",
				textColor: "text-blue-700",
				borderColor: "border-blue-200",
				label: status === "RUNNING" ? "Running" : "Pending",
			};
		default:
			return {
				icon: AlertCircle,
				bgColor: "bg-gray-50",
				textColor: "text-gray-700",
				borderColor: "border-gray-200",
				label: status,
			};
	}
};

// Helper to format duration
const formatDuration = (start: string, end?: string) => {
	const startTime = new Date(start).getTime();
	const endTime = end ? new Date(end).getTime() : Date.now();
	const durationMs = endTime - startTime;

	if (durationMs < 1000) return `${durationMs}ms`;
	if (durationMs < 60000) return `${(durationMs / 1000).toFixed(1)}s`;
	return `${(durationMs / 60000).toFixed(1)}m`;
};

export default function Executions() {
	const { id } = useParams();
	const navigate = useNavigate();
	const [executions, setExecutions] = useState([]);
	const loadExecutions = async () => {
		const response = await executionApi.getAllByWorkflowId(id!);
		if (!response) {
			console.log("Something went wrong!");
			return;
		}
		setExecutions(response.executions);
	};
	useEffect(() => {
		loadExecutions();
	}, [id]);
	return (
		<div className="w-full min-h-screen flex flex-col justify-start items-start p-6 gap-6">
			<div className="flex gap-2 items-center w-full justify-between p-2">
				<div className="flex flex-col gap-1">
					<h1 className="text-2xl md:text-3xl font-bold">Executions</h1>
					<p className="text-sm text-neutral-500">Workflow ID: {id}</p>
				</div>
				<div className="flex gap-2 items-start">
					<Button
						variant="default"
						onClick={() => {
							navigate(`/workflow/${id}`);
						}}
					>
						Open Workflow
					</Button>
					<Button
						variant="outline"
						onClick={() => {
							navigate("/dashboard");
						}}
					>
						Back to Dashboard
					</Button>
				</div>
			</div>
			<div className="w-full flex flex-col gap-4 items-center justify-center">
				{executions.length !== 0 ? (
					<div className="border border-neutral-200 rounded-lg overflow-hidden w-full">
						{executions.map((e: any, i: number) => {
							const statusConfig = getStatusConfig(e?.status);
							const StatusIcon = statusConfig.icon;
							const duration = formatDuration(e.createdAt, e.updatedAt);

							return (
								<div
									key={e._id}
									className="flex items-center gap-4 p-4 border-b border-neutral-100 last:border-b-0 hover:bg-neutral-50 transition-colors cursor-pointer"
								>
									{/* Number */}
									<div className="shrink-0 w-8 text-sm font-medium text-neutral-500">
										{executions.length - i}
									</div>

									{/* Status Badge */}
									<div
										className={`flex items-center gap-2 px-2.5 py-1 rounded-full ${statusConfig.bgColor} shrink-0`}
									>
										<StatusIcon
											className={`w-3.5 h-3.5 ${statusConfig.textColor}`}
										/>
										<span
											className={`text-xs font-medium ${statusConfig.textColor}`}
										>
											{statusConfig.label}
										</span>
									</div>

									{/* Time Info */}
									<div className="flex-1 min-w-0">
										<div className="text-sm text-neutral-900">
											{new Date(e.createdAt).toLocaleString("en-US", {
												month: "short",
												day: "numeric",
												hour: "2-digit",
												minute: "2-digit",
											})}
										</div>
										<div className="text-xs text-neutral-500 truncate">
											{e.mode && <span className="capitalize">{e.mode}</span>}
											{e.error && (
												<span className="text-red-600 ml-2">
													{e.error.message}
												</span>
											)}
										</div>
									</div>

									{/* Duration */}
									<div className="shrink-0 text-xs text-neutral-500 font-mono">
										{duration}
									</div>
								</div>
							);
						})}
					</div>
				) : (
					<div className="flex flex-col items-center justify-center py-12 border border-dashed border-neutral-200 rounded-lg">
						<Clock className="w-10 h-10 text-neutral-300 mb-3" />
						<p className="text-sm text-neutral-500">No executions yet</p>
					</div>
				)}
			</div>
		</div>
	);
}

// Component
// {
// 	executions.length !== 0 ? (
// 		<div className="space-y-3">
// 			{executions.map((e: any, i: number) => {
// 				const statusConfig = getStatusConfig(e?.status);
// 				const StatusIcon = statusConfig.icon;
// 				const duration = formatDuration(e.createdAt, e.updatedAt);

// 				return (
// 					<div
// 						key={e._id}
// 						className={`w-full border ${statusConfig.borderColor} rounded-lg hover:shadow-md transition-shadow bg-white`}
// 					>
// 						{/* Header */}
// 						<div className="flex items-center justify-between p-4 border-b border-neutral-100">
// 							<div className="flex items-center gap-3">
// 								<span className="text-sm font-medium text-neutral-500">
// 									#{executions.length - i}
// 								</span>
// 								<div
// 									className={`flex items-center gap-2 px-3 py-1 rounded-full ${statusConfig.bgColor}`}
// 								>
// 									<StatusIcon className={`w-4 h-4 ${statusConfig.textColor}`} />
// 									<span
// 										className={`text-sm font-medium ${statusConfig.textColor}`}
// 									>
// 										{statusConfig.label}
// 									</span>
// 								</div>
// 							</div>
// 							<div className="text-xs text-neutral-500">{duration}</div>
// 						</div>

// 						{/* Details */}
// 						<div className="p-4 space-y-2">
// 							<div className="grid grid-cols-2 gap-4 text-sm">
// 								<div>
// 									<div className="text-neutral-500 text-xs mb-1">Started</div>
// 									<div className="font-medium text-neutral-900">
// 										{new Date(e.createdAt).toLocaleString("en-US", {
// 											month: "short",
// 											day: "numeric",
// 											year: "numeric",
// 											hour: "2-digit",
// 											minute: "2-digit",
// 										})}
// 									</div>
// 								</div>
// 								<div>
// 									<div className="text-neutral-500 text-xs mb-1">Ended</div>
// 									<div className="font-medium text-neutral-900">
// 										{e.updatedAt ? (
// 											new Date(e.updatedAt).toLocaleString("en-US", {
// 												month: "short",
// 												day: "numeric",
// 												year: "numeric",
// 												hour: "2-digit",
// 												minute: "2-digit",
// 											})
// 										) : (
// 											<span className="text-neutral-400">Running...</span>
// 										)}
// 									</div>
// 								</div>
// 							</div>

// 							{/* Mode Badge */}
// 							{e.mode && (
// 								<div className="flex items-center gap-2 pt-2">
// 									<PlayCircle className="w-3.5 h-3.5 text-neutral-400" />
// 									<span className="text-xs text-neutral-600 capitalize">
// 										{e.mode} execution
// 									</span>
// 								</div>
// 							)}

// 							{/* Error Message */}
// 							{e.error && (
// 								<div className="mt-3 p-3 bg-red-50 border border-red-100 rounded-md">
// 									<div className="text-xs font-medium text-red-900 mb-1">
// 										Error
// 									</div>
// 									<div className="text-xs text-red-700">{e.error.message}</div>
// 								</div>
// 							)}

// 							{/* View Details Button */}
// 							<button
// 								className="mt-3 w-full text-sm text-neutral-600 hover:text-neutral-900 py-2 border border-neutral-200 rounded-md hover:bg-neutral-50 transition-colors"
// 								onClick={() => {
// 									/* Handle view details */
// 								}}
// 							>
// 								View Details
// 							</button>
// 						</div>
// 					</div>
// 				);
// 			})}
// 		</div>
// 	) : (
// 		<div className="flex flex-col items-center justify-center py-12 text-center">
// 			<Clock className="w-12 h-12 text-neutral-300 mb-4" />
// 			<h3 className="text-lg font-medium text-neutral-900 mb-1">
// 				No executions yet
// 			</h3>
// 			<p className="text-sm text-neutral-500">
// 				This workflow hasn't been executed yet. Activate it or run it manually
// 				to see results.
// 			</p>
// 		</div>
// 	);
// }
