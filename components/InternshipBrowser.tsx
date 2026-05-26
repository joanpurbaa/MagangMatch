"use client";

import { useState, useEffect } from "react";
import { Internship } from "@/app/types/types";
import Image from "next/image";

const PAGE_SIZE = 6;

export default function InternshipBrowser() {
	const [all, setAll] = useState<Internship[]>([]);
	const [query, setQuery] = useState("");
	const [filter, setFilter] = useState<"all" | "paid" | "unpaid">("all");
	const [page, setPage] = useState(1);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		fetch("/api/internships")
			.then((r) => r.json())
			.then((d) => {
				setAll(Array.isArray(d) ? d : []);
				setLoading(false);
			});
	}, []);

	const filtered = all.filter((i) => {
		const q = query.toLowerCase();
		const matchQ =
			!q ||
			i.title.toLowerCase().includes(q) ||
			i.company.toLowerCase().includes(q) ||
			i.location.toLowerCase().includes(q);
		const isPaid = i.pay !== "Tidak Diberi Uang Saku";
		const matchF = filter === "all" || (filter === "paid" ? isPaid : !isPaid);
		return matchQ && matchF;
	});

	const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
	const visible = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

	return (
		<div className="flex flex-col gap-3">
			<div className="flex gap-2">
				<input
					value={query}
					onChange={(e) => {
						setQuery(e.target.value);
						setPage(1);
					}}
					onKeyDown={(e) => e.key === "Enter" && setPage(1)}
					placeholder="Posisi, perusahaan, kota..."
					className="flex-1 px-3.5 py-2 text-[13px] border border-black/12 rounded-xl bg-white outline-none focus:border-blue-500 transition-colors placeholder:text-stone-300"
				/>
				<button
					onClick={() => setPage(1)}
					className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-[13px] font-medium rounded-xl shrink-0 transition-colors">
					Cari
				</button>
			</div>

			<div className="flex gap-1.5">
				{(["all", "paid", "unpaid"] as const).map((f) => (
					<button
						key={f}
						onClick={() => {
							setFilter(f);
							setPage(1);
						}}
						className={`text-[11px] px-3 py-1.5 rounded-full font-medium transition-all ${
							filter === f
								? "bg-blue-600 text-white"
								: "bg-white border border-black/10 text-stone-500 hover:border-black/20"
						}`}>
						{f === "all" ? "Semua" : f === "paid" ? "💰 Berbayar" : "Tidak Berbayar"}
					</button>
				))}
			</div>

			{loading &&
				Array.from({ length: 4 }).map((_, i) => (
					<div
						key={i}
						className="bg-white border border-black/8 rounded-2xl p-3.5 animate-pulse">
						<div className="flex items-center gap-2.5 mb-2">
							<div className="w-8 h-8 bg-stone-100 rounded-lg shrink-0" />
							<div className="flex-1">
								<div className="h-3 bg-stone-100 rounded w-2/3 mb-1.5" />
								<div className="h-2.5 bg-stone-100 rounded w-1/3" />
							</div>
						</div>
						<div className="flex gap-1.5">
							<div className="h-5 w-16 bg-stone-100 rounded-md" />
							<div className="h-5 w-20 bg-stone-100 rounded-md" />
						</div>
					</div>
				))}

			{/* Cards */}
			{!loading &&
				visible.map((i) => {
					const isPaid = i.pay !== "Tidak Diberi Uang Saku";
					return (
						<a
							key={i.id}
							href={i.url}
							target="_blank"
							rel="noopener noreferrer"
							className="bg-white border-[0.5px] border-l-[3px] border-black/8 border-l-blue-500 rounded-2xl p-3.5 no-underline text-inherit hover:shadow-sm hover:border-black/[0.14] transition-all group">
							<div className="flex items-center gap-2.5 mb-2">
								<Image
									src={i.companyLogo}
									width={32}
									height={32}
									className="w-8 h-8 object-contain rounded-lg border border-black/6 shrink-0"
									alt=""
								/>
								<div className="min-w-0">
									<p className="text-[13px] font-medium text-stone-900 truncate group-hover:text-blue-600 transition-colors">
										{i.title || "—"}
									</p>
									<p className="text-[11px] text-stone-400 truncate">{i.company}</p>
								</div>
							</div>
							<div className="flex flex-wrap gap-1.5">
								{i.location && (
									<span className="text-[10px] px-2 py-0.5 bg-stone-100 border border-black/6 rounded-md text-stone-500">
										📍 {i.location}
									</span>
								)}
								<span
									className={`text-[10px] px-2 py-0.5 rounded-md border ${
										isPaid
											? "bg-green-100 border-green-200/60 text-green-700"
											: "bg-stone-100 border-black/6 text-stone-400"
									}`}>
									{isPaid ? `💰 ${i.pay}` : "Tidak Berbayar"}
								</span>
								{i.duration && (
									<span className="text-[10px] px-2 py-0.5 bg-stone-100 border border-black/6 rounded-md text-stone-500">
										🕐 {i.duration}
									</span>
								)}
							</div>
						</a>
					);
				})}

			{!loading && filtered.length === 0 && (
				<div className="py-10 text-center">
					<p className="text-[12px] text-stone-400">Tidak ada lowongan ditemukan.</p>
				</div>
			)}

			{!loading && totalPages > 1 && (
				<div className="flex items-center justify-end gap-2 mt-1">
					<button
						disabled={page === 1}
						onClick={() => setPage((p) => p - 1)}
						className="text-[11px] px-3 py-1.5 rounded-lg border border-black/10 bg-white text-stone-500 disabled:opacity-40 hover:bg-stone-50 transition-colors font-mono">
						←
					</button>
					<span className="text-[11px] text-stone-400 font-mono">
						{page} / {totalPages}
					</span>
					<button
						disabled={page === totalPages}
						onClick={() => setPage((p) => p + 1)}
						className="text-[11px] px-3 py-1.5 rounded-lg border border-black/10 bg-white text-stone-500 disabled:opacity-40 hover:bg-stone-50 transition-colors font-mono">
						→
					</button>
				</div>
			)}

			{!loading && (
				<p className="text-[10px] text-stone-500 text-end font-mono">
					{filtered.length} lowongan ditemukan
				</p>
			)}
		</div>
	);
}
