import { CVData, Internship, MatchedInternship } from "@/app/types/types";
import { GoogleGenAI } from "@google/genai";
import { NextRequest, NextResponse } from "next/server";

function cvToSemanticText(cv: CVData): string {
	const parts: string[] = [];

	if (cv.name) parts.push(`Candidate: ${cv.name}`);
	if (cv.summary) parts.push(`Summary: ${cv.summary}`);

	const allSkills: string[] = [];
	if (cv.skills) {
		if (Array.isArray(cv.skills)) {
			allSkills.push(...cv.skills);
		} else {
			for (const [, skills] of Object.entries(cv.skills)) {
				if (Array.isArray(skills)) {
					allSkills.push(...skills);
				}
			}
		}
	}
	if (allSkills.length > 0) {
		parts.push(`Technical Skills: ${allSkills.join(", ")}`);
	}

	if (cv.experience && cv.experience.length > 0) {
		const expDesc = cv.experience
			.map((exp) => {
				const title = exp.position || exp.title || "";
				const company = exp.company || "";
				const desc = exp.description || "";
				return `${title} at ${company}. ${desc}`;
			})
			.join(" ");
		parts.push(`Experience: ${expDesc}`);
	}

	if (cv.projects && cv.projects.length > 0) {
		const projectDesc = cv.projects
			.map((proj) => {
				const name = proj.name || "";
				const techs = proj.technologies?.join(", ") || "";
				const desc = proj.description || "";
				return `${name} using ${techs}. ${desc}`;
			})
			.join(" ");
		parts.push(`Projects: ${projectDesc}`);
	}

	if (cv.education && cv.education.length > 0) {
		const eduDesc = cv.education
			.map((edu) => {
				const degree = edu.degree || "";
				const institution = edu.institution || "";
				return `${degree} from ${institution}`;
			})
			.join(" ");
		parts.push(`Education: ${eduDesc}`);
	}

	return parts.join(". ");
}

function internshipToSemanticText(job: Internship): string {
	const parts: string[] = [];

	parts.push(`Position: ${job.title} at ${job.company}`);

	if (job.description) {
		parts.push(`Job Description: ${job.description.slice(0, 1000)}`);
	}

	if (job.requirements && job.requirements.length > 0) {
		parts.push(`Requirements: ${job.requirements.join(". ")}`);
	}

	if (job.skills && job.skills.length > 0) {
		parts.push(`Required Skills: ${job.skills.join(", ")}`);
	}

	if (job.location) parts.push(`Location: ${job.location}`);
	if (job.duration) parts.push(`Duration: ${job.duration}`);

	return parts.join(". ");
}

const ai = new GoogleGenAI({});

function cosineSimilarity(vecA: number[], vecB: number[]): number {
	if (vecA.length !== vecB.length) return 0;

	let dotProduct = 0;
	let normA = 0;
	let normB = 0;

	for (let i = 0; i < vecA.length; i++) {
		dotProduct += vecA[i] * vecB[i];
		normA += vecA[i] * vecA[i];
		normB += vecB[i] * vecB[i];
	}

	if (normA === 0 || normB === 0) return 0;

	return dotProduct / (Math.sqrt(normA) * Math.sqrt(normB));
}

async function getEmbedding(text: string): Promise<number[]> {
	try {
		const response = await ai.models.embedContent({
			model: "gemini-embedding-2",
			contents: text,
			config: {
				outputDimensionality: 768,
				taskType: "RETRIEVAL_DOCUMENT",
			},
		});

		const embedding = response.embeddings?.[0]?.values;
		if (!embedding) {
			throw new Error("No embedding returned from Gemini");
		}

		return embedding;
	} catch (error) {
		throw error;
	}
}

async function semanticMatch(
	cv: CVData,
	internships: Internship[],
): Promise<MatchedInternship[]> {
	const cvText = cvToSemanticText(cv);

	const cvEmbedding = await getEmbedding(cvText);

	const BATCH_SIZE = 10;
	const results: MatchedInternship[] = [];

	for (let i = 0; i < internships.length; i += BATCH_SIZE) {
		const batch = internships.slice(i, i + BATCH_SIZE);

		const batchPromises = batch.map(async (internship) => {
			try {
				const jobText = internshipToSemanticText(internship);
				const jobEmbedding = await getEmbedding(jobText);

				const similarity = cosineSimilarity(cvEmbedding, jobEmbedding);
				const score = Math.round(similarity * 10 * 10) / 10;

				const cvLower = cvText.toLowerCase();

				const matchedKeywords =
					internship.skills?.filter((skill) =>
						cvLower.includes(skill.toLowerCase()),
					) || [];

				const missingSkills =
					internship.skills?.filter(
						(skill) => !cvLower.includes(skill.toLowerCase()),
					) || [];

				return {
					...internship,
					internshipId: internship.id,
					companyLogo: internship.companyLogo,
					score,
					similarity,
					cvContext: cvText.slice(0, 500),
					jobContext: jobText.slice(0, 500),
					matchedSkills: matchedKeywords,
					missingSkills: missingSkills,
					matchedKeywords: matchedKeywords,
					semanticMatches: [],
				} as MatchedInternship;
			} catch (error) {
				console.error(
					`[semantic-match] Error processing internship ${internship.id}:`,
					error,
				);

				return {
					...internship,
					internshipId: internship.id,
					score: 0,
					similarity: 0,
					cvContext: cvText.slice(0, 500),
					jobContext: internshipToSemanticText(internship).slice(0, 500),
					matchedSkills: [],
					missingSkills: internship.skills || [],
					matchedKeywords: [],
					semanticMatches: [],
				} as MatchedInternship;
			}
		});

		const batchResults = await Promise.all(batchPromises);
		results.push(...batchResults);

		if (i + BATCH_SIZE < internships.length) {
			await new Promise((resolve) => setTimeout(resolve, 500));
		}
	}

	results.sort((a, b) => b.similarity - a.similarity);

	return results;
}

export async function POST(request: NextRequest) {
	try {
		const { cv, internships }: { cv: CVData; internships: Internship[] } =
			await request.json();

		if (!cv || !internships?.length) {
			return NextResponse.json({ error: "Data tidak lengkap" }, { status: 400 });
		}

		const matches = await semanticMatch(cv, internships);

		return NextResponse.json(matches);
		// eslint-disable-next-line @typescript-eslint/no-unused-vars
	} catch (err) {
		return NextResponse.json({ error: "Matching gagal" }, { status: 500 });
	}
}
