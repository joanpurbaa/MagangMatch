import Cerebras from "@cerebras/cerebras_cloud_sdk";
import { NextRequest, NextResponse } from "next/server";
import pdf from "pdf-parse";

const client = new Cerebras({
	apiKey: process.env["CEREBRAS_API_KEY"],
});

export async function POST(request: NextRequest) {
	try {
		const formData = await request.formData();
		const file = formData.get("file") as File;

		if (!file) {
			return NextResponse.json({ error: "No file" }, { status: 400 });
		}

		const buffer = Buffer.from(await file.arrayBuffer());
		const data = await pdf(buffer);

		const aiResponse = (await client.chat.completions.create({
			model: "llama3.1-8b",
			max_tokens: 2048,
			messages: [
				{
					role: "system",
					content: `You are an expert ATS resume parser. Extract the CV into structured JSON. Return ONLY valid JSON, no explanation, no markdown.`,
				},
				{
					role: "user",
					content: `Parse this CV into this exact JSON schema:
{
  "name": "",
  "email": "",
  "phone": "",
  "location": "",
  "linkedin": "",
  "github": "",
  "portfolio": "",
  "summary": "",
  "skills": {
    "frontend": [],
    "backend": [],
    "database": [],
    "tools": [],
    "languages": []
  },
  "experience": [
    {
      "company": "",
      "position": "",
      "start_date": "",
      "end_date": "",
      "description": []
    }
  ],
  "education": [
    {
      "institution": "",
      "degree": "",
      "start_year": "",
      "end_year": ""
    }
  ],
  "projects": [
    {
      "name": "",
      "description": "",
      "technologies": []
    }
  ]
}

CV:
${data.text.slice(0, 4000)}`,
				},
			],
		})) as { choices: Array<{ message: { content: string } }> };

		const raw = aiResponse.choices[0]?.message?.content ?? "{}";
		const clean = raw.replace(/```json|```/g, "").trim();

		return NextResponse.json({
			rawText: data.text,
			ai: clean,
		});
		// eslint-disable-next-line @typescript-eslint/no-unused-vars
	} catch (error) {
		return NextResponse.json({ error: "Failed parsing" }, { status: 500 });
	}
}
