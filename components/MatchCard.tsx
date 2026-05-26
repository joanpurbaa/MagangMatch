import { MatchedInternship } from "@/app/types/types";
import Image from "next/image";

function tier(score: number): "high" | "mid" | "low" | "none" {
	if (score >= 8) return "high";
	if (score >= 5) return "mid";
	if (score >= 1) return "low";
	return "none";
}

const tierStyles = {
	high: {
		card: "border-l-[3px] border-l-green-500",
		score: "text-green-700",
		badge: "bg-green-100 text-green-700",
		bar: "bg-green-500",
		label: "Sangat Cocok",
	},
	mid: {
		card: "border-l-[3px] border-l-amber-400",
		score: "text-amber-600",
		badge: "bg-amber-100 text-amber-700",
		bar: "bg-amber-400",
		label: "Cukup Cocok",
	},
	low: {
		card: "border-l-[3px] border-l-red-400",
		score: "text-red-500",
		badge: "bg-red-100 text-red-600",
		bar: "bg-red-400",
		label: "Kurang Cocok",
	},
	none: {
		card: "border-l-[3px] border-l-stone-200",
		score: "text-stone-400",
		badge: "bg-stone-100 text-stone-500",
		bar: "bg-stone-200",
		label: "Tidak Ada Data",
	},
};

export default function MatchCard({
	item,
}: {
	item: MatchedInternship;
	rank: number;
}) {
	const t = tier(item.score);
	const s = tierStyles[t];
	const matchedSkills = item.matchedSkills || [];
	const missingSkills = item.missingSkills || [];
	const totalSkills = matchedSkills.length + missingSkills.length;
	const hasData = totalSkills > 0;
	const similarity = item.similarity ?? item.score / 10;
	const pct = hasData
		? Math.round((matchedSkills.length / totalSkills) * 100)
		: Math.round(similarity * 100);
	const semanticMatches = item.semanticMatches || [];

	return (
		<a
			href={item.url}
			target="_blank"
			rel="noopener noreferrer"
			className={`
        group bg-white border border-black/8 rounded-2xl p-4
        flex gap-4 items-start mb-3 no-underline text-inherit
        transition-all hover:shadow-sm hover:border-black/[0.14]
        ${s.card}
      `}>
			<div className="flex-1 min-w-0">
				<div className="flex items-start justify-between mb-2.5">
					<div className="flex items-center gap-2.5">
						<Image
							src={item.companyLogo}
							width={36}
							height={36}
							className="w-12 h-12 object-contain rounded-full shrink-0"
							alt=""
						/>
						<div className="min-w-0">
							<p className="text-[13px] font-medium text-stone-900 leading-snug group-hover:text-blue-600 transition-colors truncate">
								{item.title || "Posisi Tidak Diketahui"}
							</p>
							<p className="text-[11px] text-stone-400 mt-0.5 truncate">
								{item.company}
							</p>
						</div>
					</div>
				</div>

				{(item.location || item.duration || item.pay) && (
					<div className="flex flex-wrap gap-1.5 mb-2.5">
						{item.location && (
							<span className="text-[10px] px-2 py-0.5 rounded-md bg-stone-100 border border-black/6 text-stone-500">
								📍 {item.location}
							</span>
						)}
						{item.duration && (
							<span className="text-[10px] px-2 py-0.5 rounded-md bg-stone-100 border border-black/6 text-stone-500">
								🕐 {item.duration}
							</span>
						)}
						{item.pay && (
							<span className="text-[10px] px-2 py-0.5 rounded-md bg-stone-100 border border-black/6 text-stone-500">
								💰 {item.pay}
							</span>
						)}
					</div>
				)}

				<div className="space-y-2">
					<div className="flex items-center gap-2">
						<div className="flex-1 h-0.75 bg-stone-100 rounded-full overflow-hidden">
							<div
								className={`h-full rounded-full ${s.bar}`}
								style={{ width: `${pct}%` }}
							/>
						</div>
						<span className={`text-[10px] text-stone-400 font-mono shrink-0`}>
							{hasData
								? `${matchedSkills.length}/${totalSkills} skill`
								: `${Math.round(similarity * 100)}% cocok`}
						</span>
					</div>

					{hasData && matchedSkills.length > 0 && (
						<div className="flex flex-wrap gap-1">
							{matchedSkills.slice(0, 6).map((s: string) => (
								<span
									key={s}
									className="text-[10px] px-1.5 py-0.5 rounded-[5px] bg-green-100 text-green-700 font-medium">
									✓ {s}
								</span>
							))}
							{matchedSkills.length > 6 && (
								<span className="text-[10px] px-1.5 py-0.5 rounded-[5px] bg-stone-100 text-stone-400">
									+{matchedSkills.length - 6}
								</span>
							)}
						</div>
					)}

					{hasData && missingSkills.length > 0 && (
						<div className="flex flex-wrap gap-1">
							{missingSkills.slice(0, 4).map((s: string) => (
								<span
									key={s}
									className="text-[10px] px-1.5 py-0.5 rounded-[5px] bg-red-100 text-red-600 font-medium">
									✗ {s}
								</span>
							))}
							{missingSkills.length > 4 && (
								<span className="text-[10px] px-1.5 py-0.5 rounded-[5px] bg-stone-100 text-stone-400">
									+{missingSkills.length - 4} kurang
								</span>
							)}
						</div>
					)}

					{!hasData && semanticMatches.length > 0 && (
						<div className="pt-2 border-t border-black/6">
							<p className="text-[10px] text-stone-400 italic">
								📎{" "}
								{semanticMatches
									.slice(0, 2)
									.map((s: string) => `"${s.length > 50 ? s.slice(0, 50) + "…" : s}"`)
									.join(" · ")}
							</p>
						</div>
					)}
				</div>
			</div>
		</a>
	);
}
