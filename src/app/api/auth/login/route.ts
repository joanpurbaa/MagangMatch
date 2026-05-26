import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { prisma } from "../../../../../lib/prisma";
import { COOKIE_NAME, cookieOptions, signToken } from "../../../../../lib/auth";

export async function POST(req: NextRequest) {
	const { email, password } = await req.json();

	if (!email || !password) {
		return NextResponse.json(
			{ error: "Email dan password wajib diisi." },
			{ status: 400 },
		);
	}

	const user = await prisma.user.findUnique({ where: { email } });

	if (!user) {
		return NextResponse.json(
			{ error: "Email atau password salah." },
			{ status: 401 },
		);
	}

	const valid = await bcrypt.compare(password, user.passwordHash);

	if (!valid) {
		return NextResponse.json(
			{ error: "Email atau password salah." },
			{ status: 401 },
		);
	}

	const token = signToken({
		userId: user.id,
		email: user.email,
		name: user.name,
		nim: user.nim,
	});

	const res = NextResponse.json({ ok: true });
	res.cookies.set(COOKIE_NAME, token, cookieOptions());
	return res;
}
