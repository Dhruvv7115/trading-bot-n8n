export async function executeTimeTrigger(
	node: any,
	triggerData?: any,
): Promise<any> {
	console.log("Executing time trigger:", node.title);

	const { schedule } = node.data.metaData;

	return {
		type: "time",
		schedule,
		triggeredAt: new Date(),
		triggerData,
	};
}
