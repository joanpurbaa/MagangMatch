import { CvData } from "@/app/types/types";
import SectionLabel from "./SectionLabel";
import SkillBadge from "./SkillBadge";

export default function CvProfileCard({
	raw,
	open,
	onToggle,
}: {
	raw: string;
	open: boolean;
	onToggle: () => void;
}) {
	let cv: CvData = {};
	try {
		cv = JSON.parse(raw);
	} catch {}

	const skillGroups: Record<string, string[]> = {};
	if (cv.skills) {
		if (Array.isArray(cv.skills)) skillGroups["Umum"] = cv.skills as string[];
		else if (typeof cv.skills === "object") {
			Object.entries(cv.skills as Record<string, string[]>).forEach(([k, v]) => {
				if (Array.isArray(v) && v.length > 0) skillGroups[k] = v;
			});
		}
	}

	function flattenDescription(desc: unknown): string {
		if (!desc) return "";
		if (typeof desc === "string") return desc;
		if (Array.isArray(desc)) {
			return desc
				.map((item) => {
					if (typeof item === "string") return item;
					if (typeof item === "object" && item !== null) {
						const obj = item as Record<string, unknown>;
						const title = obj.title ?? "";
						const tasks = Array.isArray(obj.tasks)
							? (obj.tasks as string[]).join("; ")
							: "";
						return [title, tasks].filter(Boolean).join(": ");
					}
					return "";
				})
				.filter(Boolean)
				.join(" | ");
		}
		return String(desc);
	}

	type ExpItem = {
		posisi: string;
		tempat: string;
		durasi: string;
		deskripsi?: string;
	};
	const experiences: ExpItem[] = [
		...(cv.pengalaman ?? []).map((e: Record<string, unknown>) => ({
			posisi: (e.posisi as string) ?? "",
			tempat: (e.perusahaan as string) ?? (e.tempat as string) ?? "",
			durasi: (e.durasi as string) ?? "",
			deskripsi: flattenDescription(e.deskripsi),
		})),
		...(cv.experience ?? []).map((e: Record<string, unknown>) => ({
			posisi: (e.title as string) ?? "",
			tempat: (e.company as string) ?? "",
			durasi: (e.duration as string) ?? "",
			deskripsi: flattenDescription(e.description),
		})),
	];

	type EduItem = { institusi: string; jurusan: string; tahun: string };
	let educations: EduItem[] = [];
	if (typeof cv.pendidikan === "string") {
		educations = [{ institusi: cv.pendidikan, jurusan: "", tahun: "" }];
	} else if (Array.isArray(cv.pendidikan)) {
		educations = (cv.pendidikan as Array<Record<string, string>>).map((e) => ({
			institusi: e.institusi ?? "",
			jurusan: e.jurusan ?? "",
			tahun: e.tahun ?? "",
		}));
	} else if (Array.isArray(cv.education)) {
		educations = (cv.education as Array<Record<string, string>>).map((e) => ({
			institusi: e.institution ?? "",
			jurusan: e.degree ?? "",
			tahun: e.year ?? "",
		}));
	}

	const initials = (cv.name ?? "?")
		.split(" ")
		.slice(0, 2)
		.map((w: string) => w[0])
		.join("")
		.toUpperCase();
	const hasContent = cv.name || cv.email || Object.keys(skillGroups).length > 0;

	return (
		<div className="mt-7 border border-black/[0.08] rounded-2xl overflow-hidden">
			<button
				onClick={onToggle}
				aria-expanded={open}
				className="w-full flex items-center justify-between px-4 py-3 bg-white border-b border-black/[0.06] text-left cursor-pointer hover:bg-stone-50 transition-colors">
				<div className="flex items-center gap-2">
					<svg
						width="15"
						height="15"
						viewBox="0 0 24 24"
						fill="none"
						stroke="#5F5E58"
						strokeWidth="1.8"
						strokeLinecap="round"
						strokeLinejoin="round"
						aria-hidden="true">
						<circle cx="12" cy="8" r="4" />
						<path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" />
					</svg>
					<span className="text-[13px] font-medium text-stone-600">
						Profil dari CV
					</span>
					<span className="text-[10px] font-medium px-1.5 py-0.5 rounded-[5px] bg-blue-50 text-blue-600">
						Telkom University
					</span>
				</div>
				<span
					className={`text-[11px] text-stone-400 transition-transform duration-200 ${open ? "" : "-rotate-90"}`}>
					▼
				</span>
			</button>

			{open && (
				<div className="bg-stone-50 p-4 space-y-3">
					{!hasContent ? (
						<p className="text-[12px] text-stone-400 text-center py-4">
							Data CV tidak dapat dibaca. Coba upload ulang.
						</p>
					) : (
						<>
							{/* Identity */}
							<div className="bg-white border border-black/[0.08] rounded-xl p-4 flex items-start gap-3">
								<div className="w-11 h-11 rounded-full bg-blue-600 flex items-center justify-center shrink-0">
									<span className="text-white text-[13px] font-medium">{initials}</span>
								</div>
								<div className="min-w-0 flex-1">
									<p className="text-[15px] font-medium text-stone-900 leading-snug">
										{cv.name ?? "—"}
									</p>
									<div className="flex flex-wrap gap-x-3 gap-y-0.5 mt-1">
										{cv.email && (
											<span className="text-[11px] text-stone-500">✉ {cv.email}</span>
										)}
										{cv.phone && (
											<span className="text-[11px] text-stone-500">☎ {cv.phone}</span>
										)}
										{cv.location && (
											<span className="text-[11px] text-stone-500">📍 {cv.location}</span>
										)}
									</div>
									{(cv.linkedin || cv.github || cv.portfolio) && (
										<div className="flex flex-wrap gap-1.5 mt-1.5">
											{cv.linkedin && (
												<span className="text-[10px] px-1.5 py-0.5 bg-blue-50 text-blue-600 rounded">
													LinkedIn
												</span>
											)}
											{cv.github && (
												<span className="text-[10px] px-1.5 py-0.5 bg-stone-100 text-stone-500 rounded">
													GitHub
												</span>
											)}
											{cv.portfolio && (
												<span className="text-[10px] px-1.5 py-0.5 bg-purple-50 text-purple-600 rounded">
													Portfolio
												</span>
											)}
										</div>
									)}
								</div>
							</div>

							{/* Summary */}
							{cv.summary && (
								<div className="bg-white border border-black/[0.08] rounded-xl p-4">
									<SectionLabel
										icon={
											<svg
												width="13"
												height="13"
												viewBox="0 0 24 24"
												fill="none"
												stroke="currentColor"
												strokeWidth="1.8"
												strokeLinecap="round"
												strokeLinejoin="round">
												<path d="M12 20h9" />
												<path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4 12.5-12.5z" />
											</svg>
										}
										text="Ringkasan"
									/>
									<p className="text-[12px] text-stone-500 leading-relaxed">
										{cv.summary}
									</p>
								</div>
							)}

							{/* Skills */}
							{Object.keys(skillGroups).length > 0 && (
								<div className="bg-white border border-black/[0.08] rounded-xl p-4">
									<SectionLabel
										icon={
											<svg
												width="13"
												height="13"
												viewBox="0 0 24 24"
												fill="none"
												stroke="currentColor"
												strokeWidth="1.8"
												strokeLinecap="round"
												strokeLinejoin="round">
												<polyline points="16 18 22 12 16 6" />
												<polyline points="8 6 2 12 8 18" />
											</svg>
										}
										text="Keahlian"
									/>
									<div className="space-y-2.5">
										{Object.entries(skillGroups).map(([group, items]) => (
											<div key={group}>
												{Object.keys(skillGroups).length > 1 && (
													<p className="text-[10px] text-stone-400 mb-1 capitalize">
														{group}
													</p>
												)}
												<div className="flex flex-wrap gap-1.5">
													{items.map((s) => (
														<SkillBadge key={s} label={s} />
													))}
												</div>
											</div>
										))}
									</div>
								</div>
							)}

							{/* Experience */}
							{experiences.length > 0 && (
								<div className="bg-white border border-black/[0.08] rounded-xl p-4">
									<SectionLabel
										icon={
											<svg
												width="13"
												height="13"
												viewBox="0 0 24 24"
												fill="none"
												stroke="currentColor"
												strokeWidth="1.8"
												strokeLinecap="round"
												strokeLinejoin="round">
												<rect x="2" y="7" width="20" height="14" rx="2" />
												<path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2" />
											</svg>
										}
										text="Pengalaman"
									/>
									<div className="space-y-3">
										{experiences.map((e, i) => (
											<div
												key={i}
												className={i > 0 ? "pt-3 border-t border-black/[0.06]" : ""}>
												<div className="flex items-start justify-between gap-2">
													<div>
														<p className="text-[12px] font-medium text-stone-800">
															{e.posisi || "—"}
														</p>
														<p className="text-[11px] text-stone-400">{e.tempat}</p>
													</div>
													{e.durasi && (
														<span className="text-[10px] text-stone-400 bg-stone-100 px-2 py-0.5 rounded shrink-0">
															{e.durasi}
														</span>
													)}
												</div>
												{e.deskripsi && (
													<p className="text-[11px] text-stone-500 mt-1 leading-relaxed">
														{e.deskripsi}
													</p>
												)}
											</div>
										))}
									</div>
								</div>
							)}

							{/* Education */}
							{educations.length > 0 && (
								<div className="bg-white border border-black/[0.08] rounded-xl p-4">
									<SectionLabel
										icon={
											<svg
												width="13"
												height="13"
												viewBox="0 0 24 24"
												fill="none"
												stroke="currentColor"
												strokeWidth="1.8"
												strokeLinecap="round"
												strokeLinejoin="round">
												<path d="M22 10v6M2 10l10-5 10 5-10 5z" />
												<path d="M6 12v5c3 3 9 3 12 0v-5" />
											</svg>
										}
										text="Pendidikan"
									/>
									<div className="space-y-3">
										{educations.map((e, i) => (
											<div
												key={i}
												className={i > 0 ? "pt-3 border-t border-black/[0.06]" : ""}>
												<div className="flex items-start justify-between gap-2">
													<div>
														<p className="text-[12px] font-medium text-stone-800">
															{e.institusi || "—"}
														</p>
														{e.jurusan && (
															<p className="text-[11px] text-stone-400">{e.jurusan}</p>
														)}
													</div>
													{e.tahun && (
														<span className="text-[10px] text-stone-400 bg-stone-100 px-2 py-0.5 rounded shrink-0">
															{e.tahun}
														</span>
													)}
												</div>
											</div>
										))}
									</div>
								</div>
							)}

							{/* Languages & Certs */}
							{((cv.languages && cv.languages.length > 0) ||
								(cv.certifications && cv.certifications.length > 0)) && (
								<div className="grid grid-cols-2 gap-3">
									{cv.languages && cv.languages.length > 0 && (
										<div className="bg-white border border-black/[0.08] rounded-xl p-4">
											<SectionLabel
												icon={
													<svg
														width="13"
														height="13"
														viewBox="0 0 24 24"
														fill="none"
														stroke="currentColor"
														strokeWidth="1.8"
														strokeLinecap="round"
														strokeLinejoin="round">
														<circle cx="12" cy="12" r="10" />
														<path d="M2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
													</svg>
												}
												text="Bahasa"
											/>
											<div className="space-y-1">
												{cv.languages.map((l) => (
													<p key={l} className="text-[12px] text-stone-700">
														{l}
													</p>
												))}
											</div>
										</div>
									)}
									{cv.certifications && cv.certifications.length > 0 && (
										<div className="bg-white border border-black/[0.08] rounded-xl p-4">
											<SectionLabel
												icon={
													<svg
														width="13"
														height="13"
														viewBox="0 0 24 24"
														fill="none"
														stroke="currentColor"
														strokeWidth="1.8"
														strokeLinecap="round"
														strokeLinejoin="round">
														<circle cx="12" cy="8" r="6" />
														<path d="M15.477 12.89L17 22l-5-3-5 3 1.523-9.11" />
													</svg>
												}
												text="Sertifikasi"
											/>
											<div className="space-y-1">
												{cv.certifications.map((c) => (
													<p key={c} className="text-[12px] text-stone-700">
														{c}
													</p>
												))}
											</div>
										</div>
									)}
								</div>
							)}
						</>
					)}
				</div>
			)}
		</div>
	);
}
