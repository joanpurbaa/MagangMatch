"use client";

import { CvData } from "@/app/types/types";

interface CvDetailPanelProps {
	data: CvData;
}

export default function CvDetailPanel({ data }: CvDetailPanelProps) {
	const skills = (() => {
		if (!data.skills) return {} as Record<string, string[]>;
		if (Array.isArray(data.skills)) return { Skill: data.skills };
		return data.skills as Record<string, string[]>;
	})();

	const experience = data.pengalaman?.length
		? data.pengalaman.map((e) => ({
				role: e.posisi,
				company: e.perusahaan,
				duration: e.durasi,
				description: e.deskripsi,
			}))
		: (data.experience ?? []).map((e) => ({
				role: e.title,
				company: e.company,
				duration: e.duration,
				description: e.description,
			}));

	const education = (() => {
		const raw = data.pendidikan ?? data.education;
		if (!raw) return [];
		if (typeof raw === "string") return [{ label: raw, sub: "", year: "" }];
		return (raw as Array<Record<string, string>>).map((e) => ({
			label: e.institusi ?? e.institution ?? e.degree ?? "",
			sub: e.jurusan ?? e.degree ?? "",
			year: e.tahun ?? e.year ?? "",
		}));
	})();

	const hasSkills = Object.values(skills).some((arr) => arr.length > 0);

	return (
		<div className="space-y-2.5">
			{/* Identity */}
			<div className="bg-white border border-black/[0.08] rounded-2xl p-4">
				<div className="flex items-center gap-3 mb-3.5">
					<div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center shrink-0">
						<span className="text-[12px] font-medium text-white">
							{(data.name ?? "?")
								.split(" ")
								.slice(0, 2)
								.map((w: string) => w[0])
								.join("")
								.toUpperCase()}
						</span>
					</div>
					<div className="min-w-0">
						<p className="text-[13px] font-medium text-stone-900 truncate">
							{data.name ?? "—"}
						</p>
						{data.email && (
							<p className="text-[11px] text-stone-400 truncate">{data.email}</p>
						)}
					</div>
				</div>
				<div className="flex flex-wrap gap-1.5">
					{data.phone && <Chip icon="phone" label={data.phone} />}
					{data.location && <Chip icon="pin" label={data.location} />}
					{data.linkedin && <Chip icon="link" label="LinkedIn" />}
					{data.github && <Chip icon="link" label="GitHub" />}
				</div>
			</div>

			{data.summary && (
				<Section icon="summary" title="Ringkasan">
					<p className="text-[12px] text-stone-500 leading-relaxed">
						{data.summary}
					</p>
				</Section>
			)}

			{hasSkills && (
				<Section icon="skills" title="Keahlian">
					<div className="space-y-2.5">
						{Object.entries(skills).map(([cat, items]) =>
							items.length > 0 ? (
								<div key={cat}>
									<p className="text-[10px] font-semibold text-stone-400 uppercase tracking-wide mb-1.5">
										{cat}
									</p>
									<div className="flex flex-wrap gap-1.5">
										{items.map((s) => (
											<span
												key={s}
												className="px-2 py-0.5 bg-blue-50 text-blue-700 border border-blue-200/60 rounded-md text-[11px] font-medium">
												{s}
											</span>
										))}
									</div>
								</div>
							) : null,
						)}
					</div>
				</Section>
			)}

			{experience.length > 0 && (
				<Section icon="work" title="Pengalaman">
					<div className="space-y-3">
						{experience.map((e, i) => (
							<div key={i}>
								{i > 0 && <div className="h-px bg-black/[0.06] mb-3" />}
								<p className="text-[12px] font-medium text-stone-800">
									{e.role ?? "—"}
								</p>
								{(e.company || e.duration) && (
									<p className="text-[11px] text-stone-400 mt-0.5">
										{[e.company, e.duration].filter(Boolean).join(" · ")}
									</p>
								)}
								{e.description && (
									<p className="text-[11px] text-stone-500 mt-1.5 leading-relaxed line-clamp-3">
										{e.description}
									</p>
								)}
							</div>
						))}
					</div>
				</Section>
			)}

			{education.length > 0 && (
				<Section icon="edu" title="Pendidikan">
					<div className="space-y-2">
						{education.map((e, i) => (
							<div key={i}>
								<p className="text-[12px] font-medium text-stone-800">{e.label}</p>
								{(e.sub || e.year) && (
									<p className="text-[11px] text-stone-400">
										{[e.sub, e.year].filter(Boolean).join(" · ")}
									</p>
								)}
							</div>
						))}
					</div>
				</Section>
			)}

			{data.certifications && data.certifications.length > 0 && (
				<Section icon="cert" title="Sertifikasi">
					<div className="space-y-1">
						{data.certifications.map((c, i) => (
							<p key={i} className="text-[12px] text-stone-600">
								{c}
							</p>
						))}
					</div>
				</Section>
			)}
		</div>
	);
}

const iconMap: Record<string, React.ReactNode> = {
	summary: (
		<svg
			width="12"
			height="12"
			viewBox="0 0 24 24"
			fill="none"
			stroke="currentColor"
			strokeWidth="2"
			strokeLinecap="round"
			strokeLinejoin="round">
			<path d="M12 20h9" />
			<path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" />
		</svg>
	),
	skills: (
		<svg
			width="12"
			height="12"
			viewBox="0 0 24 24"
			fill="none"
			stroke="currentColor"
			strokeWidth="2"
			strokeLinecap="round"
			strokeLinejoin="round">
			<polyline points="16 18 22 12 16 6" />
			<polyline points="8 6 2 12 8 18" />
		</svg>
	),
	work: (
		<svg
			width="12"
			height="12"
			viewBox="0 0 24 24"
			fill="none"
			stroke="currentColor"
			strokeWidth="2"
			strokeLinecap="round"
			strokeLinejoin="round">
			<rect x="2" y="7" width="20" height="14" rx="2" />
			<path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
		</svg>
	),
	edu: (
		<svg
			width="12"
			height="12"
			viewBox="0 0 24 24"
			fill="none"
			stroke="currentColor"
			strokeWidth="2"
			strokeLinecap="round"
			strokeLinejoin="round">
			<path d="M22 10v6M2 10l10-5 10 5-10 5z" />
			<path d="M6 12v5c3 3 9 3 12 0v-5" />
		</svg>
	),
	cert: (
		<svg
			width="12"
			height="12"
			viewBox="0 0 24 24"
			fill="none"
			stroke="currentColor"
			strokeWidth="2"
			strokeLinecap="round"
			strokeLinejoin="round">
			<circle cx="12" cy="8" r="6" />
			<path d="M15.477 12.89L17 22l-5-3-5 3 1.523-9.11" />
		</svg>
	),
};

function Section({
	icon,
	title,
	children,
}: {
	icon: string;
	title: string;
	children: React.ReactNode;
}) {
	return (
		<div className="bg-white border border-black/[0.08] rounded-2xl p-4">
			<div className="flex items-center gap-1.5 mb-3">
				<span className="text-stone-400">{iconMap[icon]}</span>
				<p className="text-[10px] font-semibold text-stone-400 uppercase tracking-wide">
					{title}
				</p>
			</div>
			{children}
		</div>
	);
}

function Chip({ icon, label }: { icon: string; label: string }) {
	const icons: Record<string, React.ReactNode> = {
		phone: (
			<svg
				width="10"
				height="10"
				viewBox="0 0 24 24"
				fill="none"
				stroke="currentColor"
				strokeWidth="2"
				strokeLinecap="round"
				strokeLinejoin="round">
				<path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12 19.79 19.79 0 0 1 1.61 3.35 2 2 0 0 1 3.6 1h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L7.91 8.6a16 16 0 0 0 6 6l.96-.96a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z" />
			</svg>
		),
		pin: (
			<svg
				width="10"
				height="10"
				viewBox="0 0 24 24"
				fill="none"
				stroke="currentColor"
				strokeWidth="2"
				strokeLinecap="round"
				strokeLinejoin="round">
				<path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
				<circle cx="12" cy="10" r="3" />
			</svg>
		),
		link: (
			<svg
				width="10"
				height="10"
				viewBox="0 0 24 24"
				fill="none"
				stroke="currentColor"
				strokeWidth="2"
				strokeLinecap="round"
				strokeLinejoin="round">
				<path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
				<path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
			</svg>
		),
	};
	return (
		<span className="inline-flex items-center gap-1 px-2 py-1 bg-stone-100 border border-black/[0.06] rounded-full text-[11px] text-stone-500">
			<span className="text-stone-400">{icons[icon]}</span>
			{label}
		</span>
	);
}
