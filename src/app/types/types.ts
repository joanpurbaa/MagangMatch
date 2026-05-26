export interface Internship {
  companyLogo: string;
	id: string;
	internshipId: string;
	title: string;
	company: string;
	location: string;
	pay: string;
	duration: string;
	url: string;
	description: string;
	requirements: string[];
	skills: string[];
}

export interface MatchedInternship {
	id: string;
	companyLogo: string;
	internshipId: string;
	title: string;
	company: string;
	location: string;
	pay: string;
	duration: string;
	url: string;
	description: string;
	requirements: string[];
	skills: string[];
	score: number;
	matchedSkills: string[];
	missingSkills: string[];
	matchedKeywords: string[];
	semanticMatches: string[];
	similarity: number;
	cvContext: string;
	jobContext: string;
}

export interface CVSkills {
	frontend?: string[];
	backend?: string[];
	database?: string[];
	tools?: string[];
	languages?: string[];
}

export interface CVData {
	name?: string;
	email?: string;
	summary?: string;
	skills?: CVSkills | string[];
	experience?: Array<{
		title: string | undefined;
		position?: string;
		company?: string;
		description?: string;
	}>;
	projects?: Array<{
		name?: string;
		description?: string;
		technologies?: string[];
	}>;
	education?: Array<{ degree?: string; institution?: string }>;
}

export interface CvData {
	name?: string;
	email?: string;
	phone?: string;
	location?: string;
	linkedin?: string;
	github?: string;
	portfolio?: string;
	summary?: string;
	skills?: Record<string, string[]> | string[];
	pengalaman?: Array<{
		posisi?: string;
		perusahaan?: string;
		durasi?: string;
		deskripsi?: string;
	}>;
	experience?: Array<{
		title?: string;
		company?: string;
		duration?: string;
		description?: string;
	}>;
	pendidikan?:
		| Array<{ institusi?: string; jurusan?: string; tahun?: string }>
		| string;
	education?:
		| Array<{ institution?: string; degree?: string; year?: string }>
		| string;
	languages?: string[];
	certifications?: string[];
	[key: string]: unknown;
}
