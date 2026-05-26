import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { prisma } from "../../../../../lib/prisma";
import { COOKIE_NAME, cookieOptions, signToken } from "../../../../../lib/auth";

export async function POST(req: NextRequest) {
	const { name, email, password, nim } = await req.json();

	if (!name || !email || !password || !nim) {
		return NextResponse.json(
			{ error: "Semua field wajib diisi." },
			{ status: 400 },
		);
	}

	const existing = await prisma.user.findFirst({
		where: { OR: [{ email }, { nim }] },
	});

	if (existing) {
		return NextResponse.json(
			{ error: "Email atau NIM sudah terdaftar." },
			{ status: 409 },
		);
	}

	const passwordHash = await bcrypt.hash(password, 12);

	const user = await prisma.user.create({
		data: { name, email, passwordHash, nim },
	});

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
