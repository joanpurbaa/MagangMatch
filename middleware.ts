import { NextRequest, NextResponse } from "next/server";
import { verifyToken } from "./lib/auth";

const AUTH_ROUTES = ["/login", "/register"];

export function middleware(req: NextRequest) {
	const token = req.cookies.get("token")?.value;
	const { pathname } = req.nextUrl;

	const isAuthenticated = token ? !!verifyToken(token) : false;

	if (isAuthenticated && AUTH_ROUTES.includes(pathname)) {
		return NextResponse.redirect(new URL("/", req.url));
	}

	return NextResponse.next();
}

export const config = {
	matcher: ["/login", "/register"],
};
