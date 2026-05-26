import jwt from "jsonwebtoken";
import { cookies } from "next/headers";

const SECRET = process.env.JWT_SECRET!;
const COOKIE_NAME = "token";

export interface JwtPayload {
	userId: string;
	email: string;
	name: string;
	nim: string;
}

export function signToken(payload: JwtPayload): string {
	return jwt.sign(payload, SECRET, { expiresIn: "7d" });
}

export function verifyToken(token: string): JwtPayload | null {
	try {
		return jwt.verify(token, SECRET) as JwtPayload;
	} catch {
		return null;
	}
}

export async function getSessionUser(): Promise<JwtPayload | null> {
	const cookieStore = await cookies();
	const token = cookieStore.get(COOKIE_NAME)?.value;
	if (!token) return null;
	return verifyToken(token);
}

export function cookieOptions() {
	return {
		httpOnly: true,
		secure: process.env.NODE_ENV === "production",
		sameSite: "lax" as const,
		maxAge: 60 * 60 * 24 * 7,
		path: "/",
	};
}

export { COOKIE_NAME };
