import type { NextFunction, Request, Response } from "express";
import jwt, { type JwtPayload } from "jsonwebtoken";
const JWT_SECRET = process.env.JWT_SECRET!;

export const authMiddleware = async (
	req: Request,
	res: Response,
	next: NextFunction,
) => {
	const token = req.headers["authorization"]?.split(" ")[1] as string;
	console.log("token", token);

	if (!token) {
		res.status(400).json({
			message: "User is not logged in.",
		});
		return;
	}

	try {
		const decoded = jwt.verify(token, JWT_SECRET) as JwtPayload;
		if (!decoded) {
			res.status(400).json({
				message: "Token is invalid",
			});
			return;
		}

		req.userId = decoded.id;
		next();
	} catch (error) {
		console.log(error);
		res.status(500).json({
			message: "Something went bonkerssss!!!",
		});
		return;
	}
};
