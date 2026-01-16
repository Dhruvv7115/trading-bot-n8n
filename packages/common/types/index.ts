import z, { string } from "zod";

export const SignupSchema = z.object({
	username: z.string().min(3).max(100),
	password: z.string().min(8),
});
export const SigninSchema = z.object({
	username: z.string().min(3).max(100),
	password: z.string().min(8),
});

export const CreateWorkflowSchema = z.object({
	name: z.string().min(3).max(50),
	description: z.string().min(3).max(100).optional(),
	active: z.boolean().optional(),
	tags: z.array(string()).optional(),
	// nodes: z.array(
	// 	z.object({
	//     id: z.string(),
	//     kind: z.enum(["trigger", "action"]),
	//     type: z.enum(["hyperliquid", "lighter", "backpack", "time", "price"]),
	// 		data: z.object({
	// 			metaData: z.any(),
	// 			label: z.string(),
	// 		}),
	// 		position: z.object({
	// 			x: z.number(),
	// 			y: z.number(),
	// 		}),
	// 	}),
	// ),
	// edges: z.array(
	// 	z.object({
	// 		source: z.string(),
	// 		target: z.string(),
	// 		id: z.string(),
	// 	}),
	// ),
});

export const UpdateWorkflowSchemaBody = z.object({
	name: z.string().min(3).max(50).optional(),
	description: z.string().min(3).max(100).optional(),
	active: z.boolean().optional(),
	tags: z.array(string()).optional(),
});

export const UpdateWorkflowSchemaParams = z.object({
	id: z.string(),
});

export const GetWorkflowByIdSchema = z.object({
	id: z.string(),
});

export const DeleteWorkflowSchemaParams = z.object({
	id: z.string(),
});

export const CreateNodeSchemaBody = z.object({
	id: z.string(),
	title: z.string(),
	description: z.string(),
	kind: z.enum(["trigger", "action"]),
	type: z.enum(["hyperliquid", "lighter", "backpack", "time", "price"]),
	data: z.object({
		metaData: z.any(),
		label: z.string(),
	}),
	position: z.object({
		x: z.number(),
		y: z.number(),
	}),
});

export const CreateNodeSchemaParams = z.object({
	workflowId: z.string(),
});

export const CreateEdgeSchemaBody = z.object({
	source: z.string(),
	target: z.string(),
	id: z.string(),
});

export const CreateEdgeSchemaParams = z.object({
	workflowId: z.string(),
});
