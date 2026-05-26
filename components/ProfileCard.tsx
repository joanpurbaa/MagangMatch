"use client";

import { useState } from "react";
import Link from "next/link";
import { JwtPayload } from "../lib/auth";

interface SavedCv {
	id: string;
	label: string;
	createdAt: string;
}

interface ProfileCardProps {
	user: JwtPayload;
	savedCvs: SavedCv[];
	onLogout: () => void;
	onDeleteCv: (id: string) => void;
	onRelabelCv: (id: string, label: string) => void;
	// CHANGED: pisah dua aksi
	onViewCv: (cv: SavedCv) => void; // expand isi CV, tanpa matchmaking
	onMatchCv: (cv: SavedCv) => void; // jalankan matchmaking
	activeCvId: string | null;
	expandedCvId: string | null; // CV yang sedang di-expand (lihat isi)
}

export default function ProfileCard({
	user,
	savedCvs,
	onLogout,
	onDeleteCv,
	onRelabelCv,
	onViewCv,
	onMatchCv,
	activeCvId,
	expandedCvId,
}: ProfileCardProps) {
	const [editingId, setEditingId] = useState<string | null>(null);
	const [editLabel, setEditLabel] = useState("");

	const initials = user.name
		.split(" ")
		.slice(0, 2)
		.map((w) => w[0])
		.join("")
		.toUpperCase();

	const startEdit = (cv: SavedCv, e: React.MouseEvent) => {
		e.stopPropagation();
		setEditingId(cv.id);
		setEditLabel(cv.label);
	};

	const submitEdit = async (id: string) => {
		await onRelabelCv(id, editLabel.trim() || "CV Saya");
		setEditingId(null);
	};

	return (
		<div className="space-y-3">
			{/* User info */}
			<div className="bg-white border border-black/8 rounded-2xl p-4">
				<div className="flex items-center gap-3 mb-4">
					<div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center shrink-0">
						<span className="text-[13px] font-medium text-white">{initials}</span>
					</div>
					<div className="flex-1 min-w-0">
						<p className="text-[13px] font-medium text-stone-900 truncate">
							{user.name}
						</p>
						<p className="text-[11px] text-stone-400 truncate">{user.nim}</p>
					</div>
				</div>
				<div className="flex items-center gap-2 py-2 px-3 rounded-xl bg-stone-100 mb-3.5">
					<svg
						width="12"
						height="12"
						viewBox="0 0 24 24"
						fill="none"
						stroke="currentColor"
						strokeWidth="2"
						strokeLinecap="round"
						strokeLinejoin="round"
						className="text-stone-400 shrink-0">
						<path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
						<polyline points="22,6 12,13 2,6" />
					</svg>
					<span className="text-[11px] text-stone-500 truncate">{user.email}</span>
				</div>
				<button
					onClick={onLogout}
					className="w-full py-2 rounded-xl border border-black/10 text-[12px] font-medium text-stone-500 hover:bg-stone-50 hover:text-stone-700 transition-all">
					Keluar
				</button>
			</div>

			{/* Saved CVs */}
			<div className="bg-white border border-black/8 rounded-2xl p-4">
				<p className="text-[13px] font-medium text-stone-900 mb-0.5">
					CV Tersimpan
				</p>
				<p className="text-[11px] text-stone-400 mb-3">
					{savedCvs.length} CV · Klik untuk lihat isi
				</p>

				{savedCvs.length === 0 && (
					<p className="text-[12px] text-stone-400 text-center py-4">
						Belum ada CV tersimpan.
					</p>
				)}

				<div className="space-y-2">
					{savedCvs.map((cv) => {
						const isActive = cv.id === activeCvId; // sedang di-match
						const isExpanded = cv.id === expandedCvId; // sedang dilihat isinya

						return (
							<div key={cv.id} className="rounded-xl overflow-hidden">
								{/* CV item row — klik = lihat isi */}
								<div
									onClick={() => !editingId && onViewCv(cv)}
									className={`
                    flex items-center gap-2.5 p-2.5 border transition-all group cursor-pointer
                    ${isExpanded ? "rounded-t-xl border-b-0" : "rounded-xl"}
                    ${
																					isActive
																						? "border-blue-200 bg-blue-50"
																						: isExpanded
																							? "border-black/8 bg-stone-50"
																							: "border-black/6 bg-stone-50 hover:border-blue-100 hover:bg-blue-50/40"
																				}
                  `}>
									<div
										className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 transition-colors ${isActive ? "bg-blue-600" : "bg-blue-50"}`}>
										<svg
											width="12"
											height="12"
											viewBox="0 0 24 24"
											fill="none"
											stroke={isActive ? "white" : "#3B82F6"}
											strokeWidth="2"
											strokeLinecap="round"
											strokeLinejoin="round">
											<path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
											<polyline points="14 2 14 8 20 8" />
										</svg>
									</div>

									<div className="flex-1 min-w-0">
										{editingId === cv.id ? (
											<input
												autoFocus
												value={editLabel}
												onChange={(e) => setEditLabel(e.target.value)}
												onBlur={() => submitEdit(cv.id)}
												onKeyDown={(e) => {
													if (e.key === "Enter") submitEdit(cv.id);
													if (e.key === "Escape") setEditingId(null);
												}}
												onClick={(e) => e.stopPropagation()}
												className="w-full text-[12px] text-stone-900 bg-white border border-blue-300 rounded-md px-1.5 py-0.5 focus:outline-none"
											/>
										) : (
											<p
												className={`text-[12px] font-medium truncate ${isActive ? "text-blue-700" : "text-stone-800"}`}>
												{cv.label}
											</p>
										)}
										<p className="text-[10px] text-stone-400">
											{new Date(cv.createdAt).toLocaleDateString("id-ID", {
												day: "numeric",
												month: "short",
												year: "numeric",
											})}
											{isActive && (
												<span className="ml-1.5 text-blue-500 font-medium">· Aktif</span>
											)}
										</p>
									</div>

									{/* expand chevron */}
									<span
										className={`text-stone-300 transition-transform duration-200 mr-0.5 ${isExpanded ? "rotate-180" : ""}`}>
										<svg
											width="12"
											height="12"
											viewBox="0 0 24 24"
											fill="none"
											stroke="currentColor"
											strokeWidth="2.5"
											strokeLinecap="round"
											strokeLinejoin="round">
											<polyline points="6 9 12 15 18 9" />
										</svg>
									</span>

									{/* edit / delete */}
									<div
										className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity"
										onClick={(e) => e.stopPropagation()}>
										<button
											onClick={(e) => startEdit(cv, e)}
											className="w-6 h-6 rounded-md flex items-center justify-center hover:bg-stone-200 transition-colors">
											<svg
												width="11"
												height="11"
												viewBox="0 0 24 24"
												fill="none"
												stroke="#9B9B94"
												strokeWidth="2"
												strokeLinecap="round"
												strokeLinejoin="round">
												<path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
												<path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
											</svg>
										</button>
										<button
											onClick={(e) => {
												e.stopPropagation();
												onDeleteCv(cv.id);
											}}
											className="w-6 h-6 rounded-md flex items-center justify-center hover:bg-red-50 transition-colors">
											<svg
												width="11"
												height="11"
												viewBox="0 0 24 24"
												fill="none"
												stroke="#EF4444"
												strokeWidth="2"
												strokeLinecap="round"
												strokeLinejoin="round">
												<polyline points="3 6 5 6 21 6" />
												<path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
												<path d="M10 11v6M14 11v6" />
											</svg>
										</button>
									</div>
								</div>

								{/* Expanded: tombol Cari Magang */}
								{isExpanded && (
									<div className="border border-t-0 border-black/8 rounded-b-xl bg-white px-3 py-2.5">
										<button
											onClick={(e) => {
												e.stopPropagation();
												onMatchCv(cv);
											}}
											className={`
                        w-full py-2 rounded-lg text-[12px] font-medium transition-all flex items-center justify-center gap-1.5
                        ${
																									isActive
																										? "bg-blue-50 text-blue-700 border border-blue-200"
																										: "bg-blue-600 hover:bg-blue-700 text-white"
																								}
                      `}>
											<svg
												width="12"
												height="12"
												viewBox="0 0 24 24"
												fill="none"
												stroke="currentColor"
												strokeWidth="2.5"
												strokeLinecap="round"
												strokeLinejoin="round">
												<circle cx="11" cy="11" r="8" />
												<line x1="21" y1="21" x2="16.65" y2="16.65" />
											</svg>
											{isActive ? "Sedang Dicocokkan" : "Cari Magang"}
										</button>
									</div>
								)}
							</div>
						);
					})}
				</div>
			</div>
		</div>
	);
}

export function ProfileCardGuest() {
	return (
		<div className="bg-white border border-black/8 rounded-2xl p-5 text-center">
			<div className="w-10 h-10 bg-stone-100 rounded-full flex items-center justify-center mx-auto mb-3">
				<svg
					width="18"
					height="18"
					viewBox="0 0 24 24"
					fill="none"
					stroke="#9B9B94"
					strokeWidth="1.8"
					strokeLinecap="round"
					strokeLinejoin="round">
					<path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
					<circle cx="12" cy="7" r="4" />
				</svg>
			</div>
			<p className="text-[13px] font-medium text-stone-800 mb-1">Simpan CV kamu</p>
			<p className="text-[12px] text-stone-400 mb-4 leading-relaxed">
				Daftar untuk menyimpan hasil analisis CV dan langsung pakai untuk mencari
				lowongan tanpa upload ulang.
			</p>
			<div className="flex gap-2">
				<Link
					href="/register"
					className="flex-1 py-2 bg-blue-600 text-white rounded-xl text-[12px] font-medium hover:bg-blue-700 transition-colors text-center">
					Daftar
				</Link>
				<Link
					href="/login"
					className="flex-1 py-2 border border-black/10 text-stone-600 rounded-xl text-[12px] font-medium hover:bg-stone-50 transition-colors text-center">
					Masuk
				</Link>
			</div>
		</div>
	);
}
