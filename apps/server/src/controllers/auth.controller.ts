import { SigninSchema, SignupSchema } from "common/types";
import { User } from "db/schemas";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import type { Request, Response } from "express";

const JWT_SECRET = process.env.JWT_SECRET!;

export const signupController = async (req: Request, res: Response) => {
	const { success, data } = SignupSchema.safeParse(req.body);
	if (!success) {
		res.status(403).json({
			message: "Incorrect inputs",
		});
		return;
	}

	try {
		const existingUser = await User.findOne({ username: data.username });

		if (existingUser) {
			res.status(400).json({
				message: "User with this username already exists try another one.",
			});
			return;
		}

		const hashedPassword = await bcrypt.hash(data.password, 10);
		const newUser = await User.create({
			username: data.username,
			password: hashedPassword,
		});

		res.status(200).json({
			message: "Signed up successfully.",
			id: newUser._id,
		});
	} catch (error: any) {
		console.error("Error in signup controller:", error.message);

		res.status(500).json({
			message: "Error while creating a new user.",
			error: error.message,
		});
		return;
	}
};
export const signinController = async (req: Request, res: Response) => {
	const { success, data } = SigninSchema.safeParse(req.body);
	if (!success) {
		res.status(403).json({
			message: "Incorrect inputs",
		});
		return;
	}
	try {
		const user = await User.findOne({
			username: data.username,
		});

		if (!user) {
			res.status(400).json({
				message: "User with this username doesn't exist",
			});
			return;
		}

		const comparePassword = await bcrypt.compare(data.password, user.password);

		if (!comparePassword) {
			res.status(400).json({
				message: "Wrong password!",
			});
			return;
		}
		const token = jwt.sign(
			{
				id: user._id,
			},
			JWT_SECRET,
		);

		res.status(200).json({
			message: "User signed in successfully.",
			token,
			id: user._id,
		});
	} catch (error: any) {
		console.error("Error in signin controller:", error.message);
		res.status(500).json({
			message: "Something went bonkersss!!!",
			error: error.message,
		});
		return;
	}
};
