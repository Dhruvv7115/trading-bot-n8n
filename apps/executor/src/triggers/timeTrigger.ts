export async function executeTimeTrigger(
	node: any,
	triggerData?: any,
): Promise<any> {
	console.log("⏰ Executing time trigger:", node.title);

	const { time, unit = "seconds" } = node.data.metaData;

	return {
		type: "time",
		time,
		unit,
		triggeredAt: triggerData?.timestamp || new Date(),
		triggerData,
	};
}
