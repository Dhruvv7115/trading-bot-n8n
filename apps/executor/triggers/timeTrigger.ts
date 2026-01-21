export async function executeTimeTrigger(
	node: any,
	triggerData?: any,
): Promise<any> {
	console.log("Executing time trigger:", node.title);

	const { time } = node.data.metaData;

	return {
		type: "time",
		time,
		triggeredAt: new Date(),
		triggerData,
	};
}
