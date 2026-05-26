import internshipInfo from "@/app/resource/internship";
import Cerebras from "@cerebras/cerebras_cloud_sdk";
import { NextResponse } from "next/server";

function createSemanticChunks(): Array<{ id: string; content: string }> {
	const chunks: Array<{ id: string; content: string }> = [];

	chunks.push({
		id: "metadata_kontak",
		content: `
INFORMASI DASAR MAGANG FIT TELKOM UNIVERSITY:
${Object.entries(internshipInfo.metadata)
	.map(([k, v]) => `${k}: ${v}`)
	.join("\n")}

KONTAK DAN LINK PENTING:
${Object.entries(internshipInfo.kontak_dan_link_penting)
	.map(([k, v]) => `${k}: ${v}`)
	.join("\n")}
    `.trim(),
	});

	chunks.push({
		id: "durasi_waktu",
		content: `
DURASI DAN WAKTU MAGANG:

Durasi umum magang: ${internshipInfo.pendahuluan.durasi_kegiatan}

MAGANG 1 SEMESTER:
- Durasi: ${internshipInfo.skema_magang.magang_1_semester.durasi}
- Semester pelaksanaan: ${internshipInfo.skema_magang.magang_1_semester.semester_pelaksanaan}

MAGANG 2 SEMESTER (MADUSEM):
- Durasi: ${internshipInfo.skema_magang.magang_2_semester.durasi}
- Minimal: 9 bulan, Maksimal: 12 bulan
- Semester pelaksanaan: ${internshipInfo.skema_magang.magang_2_semester.semester_pelaksanaan}

MAGANG EKSTENSI:
- Durasi: ${internshipInfo.jenis_magang.daftar_jenis.magang_ekstensi.durasi}

MAGANG MBKM:
- Durasi: ${internshipInfo.jenis_magang.daftar_jenis.magang_mbkm.durasi}

Durasi per jenis magang:
${Object.entries(internshipInfo.availability_durasi_per_jenis)
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	.map(([key, val]: [string, any]) => {
		if (key === "catatan_umum") return `Catatan: ${val}`;
		return `- ${key}: ${val.durasi}`;
	})
	.join("\n")}

Rentang pelaksanaan magang (jadwal terbaru): ${internshipInfo.agenda_magang.jadwal.rentang_pelaksanaan_magang.periode}
    `.trim(),
	});

	chunks.push({
		id: "pendahuluan_tujuan",
		content: `
PENDAHULUAN MAGANG:
Definisi: ${internshipInfo.pendahuluan.definisi_magang}
Mulai berlaku: ${internshipInfo.pendahuluan.mulai_berlaku}
Tingkat pelaksanaan: D3 tingkat ${internshipInfo.pendahuluan.tingkat_pelaksanaan.D3}, D4 tingkat ${internshipInfo.pendahuluan.tingkat_pelaksanaan.D4_atau_Sarjana_Terapan}

Lingkup pekerjaan: ${internshipInfo.pendahuluan.lingkup_pekerjaan.join(", ")}
Output pekerjaan: ${internshipInfo.pendahuluan.output_pekerjaan.join(", ")}
Softskill: ${internshipInfo.pendahuluan.softskill_yang_dikembangkan.join(", ")}
Mata kuliah terkait: ${internshipInfo.pendahuluan.mata_kuliah_terkait.join(", ")}

TUJUAN MAGANG:
Umum: ${internshipInfo.tujuan_magang.umum.join("; ")}
Bagi Perusahaan: ${internshipInfo.tujuan_magang.bagi_perusahaan.join("; ")}
Bagi Fakultas: ${internshipInfo.tujuan_magang.bagi_fakultas.join("; ")}
    `.trim(),
	});

	chunks.push({
		id: "persyaratan",
		content: `
PERSYARATAN MAGANG:

Syarat Umum:
${internshipInfo.persyaratan_magang.syarat_umum.map((s, i) => `${i + 1}. ${s}`).join("\n")}

Syarat Khusus Magang 2 Semester (MADUSEM):
${internshipInfo.persyaratan_magang.syarat_khusus_magang_2_semester_MADUSEM.map((s, i) => `${i + 1}. ${s}`).join("\n")}

Catatan: ${internshipInfo.persyaratan_magang.catatan}
    `.trim(),
	});

	chunks.push({
		id: "jenis_magang",
		content: `
JENIS-JENIS MAGANG DI FIT:

${Object.entries(internshipInfo.jenis_magang.daftar_jenis)
	.map(
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		([, val]: [string, any]) => `
--- ${val.nama} ---
Deskripsi: ${val.deskripsi}
${val.cara_lihat_lowongan ? `Cara lihat lowongan: ${val.cara_lihat_lowongan.join(", ")}` : ""}
${val.syarat_khusus ? `Syarat khusus: ${val.syarat_khusus.join(", ")}` : ""}
${val.catatan ? `Catatan: ${val.catatan}` : ""}
${val.durasi ? `Durasi: ${val.durasi}` : ""}
`,
	)
	.join("\n")}
    `.trim(),
	});

	chunks.push({
		id: "skema_magang",
		content: `
SKEMA MAGANG:

MAGANG 1 SEMESTER:
- Durasi: ${internshipInfo.skema_magang.magang_1_semester.durasi}
- Semester: ${internshipInfo.skema_magang.magang_1_semester.semester_pelaksanaan}
- Lingkup pekerjaan: ${internshipInfo.skema_magang.magang_1_semester.lingkup_pekerjaan}
- Rekognisi: ${internshipInfo.skema_magang.magang_1_semester.rekognisi_nilai}

MAGANG 2 SEMESTER (MADUSEM):
- Durasi: ${internshipInfo.skema_magang.magang_2_semester.durasi}
- Semester: ${internshipInfo.skema_magang.magang_2_semester.semester_pelaksanaan}
- Lingkup pekerjaan: ${internshipInfo.skema_magang.magang_2_semester.lingkup_pekerjaan}
- Rekognisi: ${internshipInfo.skema_magang.magang_2_semester.rekognisi_nilai}
- Catatan: ${internshipInfo.skema_magang.magang_2_semester.catatan_penting}
    `.trim(),
	});

	chunks.push({
		id: "penilaian",
		content: `
PENILAIAN MAGANG:
MK Magang (8 SKS): 60% Pembimbing Lapangan + 40% Dosen Pembimbing Akademik
MK Seminar Magang (4 SKS): 100% Dosen Pembimbing Akademik

Rubrik Penilaian DPA:
- Pemahaman mitra magang: 30 poin
- Presentasi dan tanya jawab: 30 poin
- Kemampuan laporan: 40 poin

Rubrik Penilaian PL:
- Softskill: 40 poin
- Hardskill: 60 poin
    `.trim(),
	});

	chunks.push({
		id: "tahapan_dokumen",
		content: `
TAHAPAN PELAKSANAAN MAGANG:
${internshipInfo.tahap_pelaksanaan_magang.urutan_tahap.join(" → ")}

DOKUMEN MAGANG:
Link template: ${internshipInfo.dokumen_magang.link_template}

Dokumen SEBELUM magang:
${internshipInfo.dokumen_magang.dokumen_sebelum_magang.map((d, i) => `${i + 1}. ${d}`).join("\n")}

Dokumen SETELAH magang:
${internshipInfo.dokumen_magang.dokumen_setelah_magang.map((d, i) => `${i + 1}. ${d}`).join("\n")}
    `.trim(),
	});

	chunks.push({
		id: "agenda_jadwal",
		content: `
AGENDA MAGANG (Periode terbaru):
${Object.entries(internshipInfo.agenda_magang.jadwal)
	.map(
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		([key, val]: [string, any]) => `
${key.toUpperCase()}:
${Object.entries(val)
	.map(([k, v]) => `  - ${k}: ${v}`)
	.join("\n")}
`,
	)
	.join("\n")}

CATATAN: ${internshipInfo.agenda_magang.catatan_penting}
    `.trim(),
	});

	chunks.push({
		id: "faq",
		content: `
PERTANYAAN UMUM (FAQ):

${Object.entries(internshipInfo.faq)
	.map(
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		([, val]: [string, any]) => `
Pertanyaan: ${val.pertanyaan}
Jawaban: ${val.jawaban}
`,
	)
	.join("\n")}
    `.trim(),
	});

	chunks.push({
		id: "lowongan_fakultas",
		content: `
LOWONGAN MAGANG FAKULTAS:
Proses: ${internshipInfo.lowongan_magang_fakultas.proses}
Platform info: ${internshipInfo.lowongan_magang_fakultas.platform_info.join(", ")}
    `.trim(),
	});

	chunks.push({
		id: "periode_prodi",
		content: `
PERIODE MAGANG PER PROGRAM STUDI:

Semester Ganjil:
${internshipInfo.periode_magang_per_prodi.semester_ganjil.map((p) => `- ${p}`).join("\n")}

Semester Genap:
${internshipInfo.periode_magang_per_prodi.semester_genap.map((p) => `- ${p}`).join("\n")}
    `.trim(),
	});

	return chunks;
}

function keywordScore(query: string, text: string): number {
	const q = query.toLowerCase();
	const t = text.toLowerCase();

	const words = q.split(/\s+/).filter((w) => w.length > 2);

	let score = 0;
	for (const word of words) {
		if (t.includes(word)) score += 1;

		if (t.substring(0, 200).includes(word)) score += 2;
	}

	return score;
}

const client = new Cerebras({
	apiKey: process.env["CEREBRAS_API_KEY"],
});

export async function GET(request: Request) {
	try {
		const { searchParams } = new URL(request.url);
		const question = searchParams.get("q") || "info magang FIT Telkom University";

		const chunks = createSemanticChunks();

		const chunkScores = chunks.map((chunk) => ({
			id: chunk.id,
			content: chunk.content,
			score: keywordScore(question, chunk.content),
		}));

		chunkScores.sort((a, b) => b.score - a.score);
		const topChunks = chunkScores.slice(0, 3);

		const bestContext = topChunks.map((c) => c.content).join("\n\n---\n\n");

		const aiResponse = await client.chat.completions.create({
			model: "llama3.1-8b",
			max_tokens: 1024,
			messages: [
				{
					role: "system",
					content: `Anda adalah asisten magang untuk Fakultas Ilmu Terapan (FIT) Universitas Telkom.
JAWAB PERTANYAAN BERDASARKAN KONTEKS YANG DISEDIAKAN SAJA.
Jika konteks tidak mengandung jawaban, katakan: "Maaf, informasi tentang [topik] tidak ditemukan."`,
				},
				{
					role: "user",
					content: `Konteks:\n${bestContext}\n\nPertanyaan: ${question}\n\nJawaban (Bahasa Indonesia, singkat dan jelas):`,
				},
			],
		});

		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		const choices = (aiResponse as any)?.choices;
		const answer =
			choices?.[0]?.message?.content ?? "Maaf, tidak dapat menghasilkan jawaban.";

		return NextResponse.json({
			success: true,
			question,
			answer,
			context_used: topChunks.map((c) => ({ id: c.id, score: c.score })),
		});
	} catch (error) {
		return NextResponse.json(
			{
				success: false,
				error: error instanceof Error ? error.message : "Unknown error",
				question: "Error occurred",
			},
			{ status: 500 },
		);
	}
}
