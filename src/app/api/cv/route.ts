import { NextRequest, NextResponse } from "next/server";
import { getSessionUser } from "../../../../lib/auth";
import { prisma } from "../../../../lib/prisma";

export async function GET() {
	const session = await getSessionUser();
	if (!session)
		return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

	const cvs = await prisma.savedCv.findMany({
		where: { userId: session.userId },
		orderBy: { createdAt: "desc" },
		select: { id: true, label: true, createdAt: true, raw: true },
	});

	return NextResponse.json(cvs);
}

export async function POST(req: NextRequest) {
	const session = await getSessionUser();
	if (!session)
		return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

	const { raw, label } = await req.json();

	if (!raw)
		return NextResponse.json({ error: "CV data wajib ada." }, { status: 400 });

	const cv = await prisma.savedCv.create({
		data: {
			userId: session.userId,
			raw,
			label: label ?? "CV Saya",
		},
		select: { id: true, label: true, createdAt: true, raw: true },
	});

	return NextResponse.json(cv);
}
