import z, { string } from "zod";

// ========= BASE SCHEMAS =========

const mongoIdSchema = z
	.string()
	.regex(/^[0-9a-fA-F]{24}$/, "Invalid MongoDB ObjectId");

// ========= AUTH SCHEMAS =========

const authBaseSchema = z.object({
	username: z.string().min(3).max(100),
	password: z.string().min(8),
});

export const SignupSchema = authBaseSchema;
export const SigninSchema = authBaseSchema;

// ========= WORKFLOW SCHEMAS =========

const workflowBaseSchema = z.object({
	name: z.string().min(3).max(50),
	description: z.string().min(3).max(100).optional(),
	active: z.boolean().optional(),
	tags: z.array(z.string()).optional(),
});

export const CreateWorkflowSchema = workflowBaseSchema;

export const UpdateWorkflowSchemaBody = workflowBaseSchema.partial();

export const WorkflowIdParamsSchema = z.object({
	id: mongoIdSchema,
});

// aliases
export const UpdateWorkflowSchemaParams = WorkflowIdParamsSchema;

export const GetWorkflowByIdSchema = WorkflowIdParamsSchema;

export const DeleteWorkflowSchemaParams = WorkflowIdParamsSchema;

// ========= NODE SCHEMAS =========

const nodeBaseSchema = z.object({
	id: z.string(),
	title: z.string(),
	description: z.string(),
	type: z.enum(["hyperliquid", "lighter", "backpack", "time", "price"]),
	data: z.object({
		metaData: z.any(),
		kind: z.enum(["TRIGGER", "ACTION"]),
	}),
	position: z.object({
		x: z.number(),
		y: z.number(),
	}),
});

export const CreateNodeSchemaBody = nodeBaseSchema;

export const UpdateNodeSchemaBody = nodeBaseSchema
	.omit({ id: true }) // Can't update ID
	.partial(); // All fields optional for update

export const NodeWorkflowParamsSchema = z.object({
	workflowId: mongoIdSchema,
});

export const NodeParamsSchema = z.object({
	workflowId: mongoIdSchema,
	nodeId: z.string(),
});

// Aliases
export const CreateNodeSchemaParams = NodeWorkflowParamsSchema;
export const UpdateNodeSchemaParams = NodeParamsSchema;
export const DeleteNodeSchemaParams = NodeParamsSchema;
export const GetNodeSchemaParams = NodeParamsSchema;

// ========= EDGE SCHEMAS =========
const edgeBaseSchema = z.object({
	id: z.string(),
	source: z.string(),
	target: z.string(),
});

export const CreateEdgeSchemaBody = edgeBaseSchema;

export const EdgeWorkflowParamsSchema = z.object({
	workflowId: mongoIdSchema,
});

export const EdgeParamsSchema = z.object({
	workflowId: mongoIdSchema,
	edgeId: z.string(),
});

// Aliases for clarity
export const CreateEdgeSchemaParams = EdgeWorkflowParamsSchema;
export const DeleteEdgeSchemaParams = EdgeParamsSchema;
