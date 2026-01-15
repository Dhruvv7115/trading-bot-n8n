import mongoose, { Schema } from "mongoose";

const userSchema = new Schema({
	username: {
		type: String,
		required: true,
		unique: true,
	},
	password: {
		type: String,
		required: true,
	},
});

const edgeSchema = new Schema(
	{
		id: {
			type: String,
			required: true,
		},
		source: {
			type: String,
			required: true,
		},
		target: {
			type: String,
			required: true,
		},
		workflowId: {
			type: Schema.Types.ObjectId,
			ref: "Workflow",
		},
	},
	{
		_id: false,
	},
);

const positionSchema = new Schema(
	{
		x: {
			type: Number,
			required: true,
		},
		y: {
			type: Number,
			required: true,
		},
	},
	{
		_id: false,
	},
);

const nodeDataSchema = new Schema(
	{
		metaData: {
			type: Schema.Types.Mixed,
			required: true,
		},
		label: {
			type: String,
			required: true,
		},
	},
	{
		_id: false,
	},
);

const credentialSchema = new Schema(
	{
		name: {
			// "hyperliquid", "lighter", etc.
			type: String,
			required: true,
		},
		type: {
			// "api_key", "password", etc.
			type: String,
			required: true,
		},
		data: {
			type: Schema.Types.Mixed,
			required: true,
		},
		userId: {
			type: Schema.Types.ObjectId,
			ref: "User",
		},
	},
	{
		_id: false,
	},
);

const nodeSchema = new Schema(
	{
		id: {
			type: String,
			required: true,
		},
		workflowId: {
			type: Schema.Types.ObjectId,
			ref: "Workflow",
		},
		title: {
			type: String,
			required: true,
		},
		description: {
			type: String,
			required: true,
		},
		type: {
			type: String,
			enum: ["hyperliquid", "lighter", "backpack", "time", "price"],
			require: true,
		},
		position: positionSchema,
		data: nodeDataSchema,
		kind: {
			type: String,
			enum: ["trigger", "action"],
			required: true,
		},
	},
	{
		_id: false,
	},
);

const workflowSchema = new Schema({
	name: {
		type: String,
		required: true,
	},
	description: String,
	active: Boolean,
	tags: [String],
	userId: {
		type: Schema.Types.ObjectId,
		ref: "User",
	},
});

const executionSchema = new Schema({
	workflowId: {
		type: Schema.Types.ObjectId,
		ref: "Workflow",
	},
	status: {
		type: String,
		enum: ["SUCCESS", "FAILURE", "PENDING"],
		required: true,
	},
	startTime: {
		type: Date,
		default: Date.now(),
	},
	endTime: {
		type: Date,
		required: true,
	},
	failedNode: {
		type: Schema.Types.ObjectId,
		ref: "Node",
	},
});

export const User = mongoose.model("User", userSchema);
export const Workflow = mongoose.model("Workflow", workflowSchema);
export const Edge = mongoose.model("Edge", edgeSchema);
export const Node = mongoose.model("Node", nodeSchema);
export const Execution = mongoose.model("Execution", executionSchema);
