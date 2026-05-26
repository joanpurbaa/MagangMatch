import { NextRequest, NextResponse } from "next/server";
import { getSessionUser } from "../../../../../lib/auth";
import { prisma } from "../../../../../lib/prisma";

export async function DELETE(
	_req: NextRequest,
	{ params }: { params: Promise<{ cvId: string }> },
) {
	const session = await getSessionUser();
	if (!session)
		return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

	const { cvId } = await params;

	const cv = await prisma.savedCv.findUnique({ where: { id: cvId } });

	if (!cv || cv.userId !== session.userId) {
		return NextResponse.json({ error: "Not found" }, { status: 404 });
	}

	await prisma.savedCv.delete({ where: { id: cvId } });

	return NextResponse.json({ ok: true });
}

export async function PATCH(
	req: NextRequest,
	{ params }: { params: Promise<{ cvId: string }> },
) {
	const session = await getSessionUser();
	if (!session)
		return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

	const { cvId } = await params;
	const { label } = await req.json();

	const cv = await prisma.savedCv.findUnique({ where: { id: cvId } });

	if (!cv || cv.userId !== session.userId) {
		return NextResponse.json({ error: "Not found" }, { status: 404 });
	}

	const updated = await prisma.savedCv.update({
		where: { id: cvId },
		data: { label },
	});

	return NextResponse.json(updated);
}
