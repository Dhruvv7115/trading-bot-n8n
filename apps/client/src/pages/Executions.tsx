import { Button } from "@/components/ui/button";
import { executionApi } from "@/lib/api";
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

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
		<div className="w-full min-h-screen flex flex-col justify-start items-start p-4">
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
			<div className="w-full flex flex-col gap-2 items-center justify-center my-auto">
				{executions.length !== 0 ? (
					executions.map((e: any, i: number) => (
						<div className="w-full flex flex-col gap-2 p-4">
							<div className="flex gap-2 items-start">
								<span>{executions.length - i}</span>
								<span>{e?.status}</span>
							</div>
							<div className="flex gap-2 items-start">
								<span>Start Time: {e.createdAt}</span>
								<span>End Time: {e.updatedAt}</span>
							</div>
						</div>
					))
				) : (
					<div className="w-full text-center">
						No Executions found for this workflow!
					</div>
				)}
			</div>
		</div>
	);
}
