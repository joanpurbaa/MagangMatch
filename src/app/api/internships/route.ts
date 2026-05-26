import { NextResponse } from "next/server";
import { prisma } from "../../../../lib/prisma";
import { Internship } from "@/app/types/types";
import { Redis } from "@upstash/redis";

const redis = Redis.fromEnv();

function splitSemicolon(value: string | null | undefined): string[] {
	if (!value) return [];

	return value
		.split(";")
		.map((s) => s.trim())
		.filter(Boolean);
}

const CACHE_KEY = "internships:all";
const CACHE_TTL = 60 * 60 * 5;

export async function GET() {
	try {
		const cached = await redis.get<Internship[]>(CACHE_KEY);

		if (cached) {
			return NextResponse.json(cached, {
				headers: {
					"x-cache": "HIT",
				},
			});
		}

		const rows = await prisma.internship.findMany();

		const internships: Internship[] = rows.map((row) => ({
			id: String(row.id),
			companyLogo: String(row.companyLogo),
			internshipId: String(row.internshipId),
			title: row.position ?? "",
			company: row.companyName ?? "",
			location: row.city ?? "",
			pay: row.salary ? String(row.salary) : "Tidak Diberi Uang Saku",
			duration: row.minimumSemester ? `${row.minimumSemester} Semester` : "",
			url: `${process.env.NEXT_PUBLIC_BASE_URL}/detail-lowongan/${row.internshipId}`,
			description: row.jobDescription ?? "",
			requirements: splitSemicolon(row.requirements),
			skills: splitSemicolon(row.skills as string),
		}));

		await redis.set(CACHE_KEY, internships, {
			ex: CACHE_TTL,
		});

		return NextResponse.json(internships, {
			headers: {
				"x-cache": "MISS",
			},
		});
	} catch (err) {
		return NextResponse.json({ error: err }, { status: 500 });
	}
}
