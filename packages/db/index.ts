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

const edgeSchema = new Schema({
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
		required: true,
	},
});

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

const credentialSchema = new Schema(
	{
		name: String,
		type: {
			type: String,
			enum: [
				"hyperliquid",
				"lighter",
				"backpack",
				"binance",
				"coinbase",
				"smtp",
				"imap",
				"postgresql",
				"mysql",
				"google_oauth2",
				"api_key",
				"basic_auth",
			],
			required: true,
		},
		data: {
			type: Schema.Types.Mixed, // encrypted
			required: true,
		},
		userId: {
			type: Schema.Types.ObjectId,
			ref: "User",
			required: true,
			index: true,
		},
	},
	{
		timestamps: true,
	},
);

const nodeSchema = new Schema({
	id: {
		type: String,
		required: true,
	},
	workflowId: {
		type: Schema.Types.ObjectId,
		ref: "Workflow",
		required: true,
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
		required: true,
	},
	position: positionSchema,
	data: {
		metaData: Schema.Types.Mixed,
		kind: {
			type: String,
			enum: ["TRIGGER", "ACTION"],
			required: true,
		},
	},
	credentialId: {
		type: Schema.Types.ObjectId,
		ref: "Credential",
		// Only required for nodes that need credentials (not time/price triggers)
		required: function () {
			return ["hyperliquid", "lighter", "backpack"].includes(this.type);
		},
	},
});

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
		index: true,
	},
});

const executionSchema = new Schema(
	{
		workflowId: {
			type: Schema.Types.ObjectId,
			ref: "Workflow",
			required: true,
		},
		mode: {
			type: String,
			enum: ["manual", "trigger", "webhook", "scheduled"],
			required: true,
		},
		status: {
			type: String,
			enum: ["SUCCESS", "FAILURE", "PENDING"],
			required: true,
		},
		endTime: Date,
		failedNode: {
			type: Schema.Types.ObjectId,
			ref: "Node",
		},
		data: {
			type: Schema.Types.Mixed,
			default: {},
		},
	},
	{
		timestamps: true,
	},
);

//indices
executionSchema.index({ workflowId: 1, status: 1, createdAt: -1 });
edgeSchema.index({ workflowId: 1, id: 1 }, { unique: true });
nodeSchema.index({ workflowId: 1, id: 1 }, { unique: true });

// models
export const User = mongoose.model("User", userSchema);
export const Workflow = mongoose.model("Workflow", workflowSchema);
export const Edge = mongoose.model("Edge", edgeSchema);
export const Node = mongoose.model("Node", nodeSchema);
export const Credential = mongoose.model("Credential", credentialSchema);
export const Execution = mongoose.model("Execution", executionSchema);
