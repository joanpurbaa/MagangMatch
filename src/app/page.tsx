"use client";

import { useState, useRef, useEffect } from "react";
import { MatchedInternship, CvData } from "./types/types";
import MatchCard from "../../components/MatchCard";
import SkeletonCard from "../../components/SkeletonCard";
import StepBar from "../../components/StepBar";
import ChatBot from "../../components/ChatBot";
import Image from "next/image";
import InternshipBrowser from "../../components/InternshipBrowser";
import ProfileCard, { ProfileCardGuest } from "../../components/ProfileCard";
import SaveCvModal from "../../components/SaveCvModal";
import CvDetailPanel from "../../components/CvDetailPanel";
import { JwtPayload } from "../../lib/auth";

type StepState = "idle" | "active" | "done";
type Phase = "idle" | "parsing" | "loading" | "matching" | "done";

interface SavedCv {
	id: string;
	label: string;
	createdAt: string;
	raw?: CvData;
}

type MobileTab = "browse" | "match" | "profile";

export default function Home() {
	const [file, setFile] = useState<File | null>(null);
	const [phase, setPhase] = useState<Phase>("idle");
	const [matches, setMatches] = useState<MatchedInternship[]>([]);
	const [matchError, setMatchError] = useState<string | null>(null);
	const [dragging, setDragging] = useState(false);
	const [isChatOpen, setIsChatOpen] = useState(false);
	const fileInputRef = useRef<HTMLInputElement>(null);

	const [user, setUser] = useState<JwtPayload | null>(null);
	const [savedCvs, setSavedCvs] = useState<SavedCv[]>([]);
	const [showSaveModal, setShowSaveModal] = useState(false);
	const [activeCvId, setActiveCvId] = useState<string | null>(null);
	const [expandedCvId, setExpandedCvId] = useState<string | null>(null);
	const [activeCvData, setActiveCvData] = useState<CvData | null>(null);

	const [mobileTab, setMobileTab] = useState<MobileTab>("match");

	useEffect(() => {
		fetch("/api/auth/me")
			.then((r) => r.json())
			.then((d) => {
				if (d.user) {
					setUser(d.user);
					// eslint-disable-next-line react-hooks/immutability
					fetchSavedCvs();
				}
			})
			.catch(() => {});
	}, []);

	const fetchSavedCvs = async () => {
		const res = await fetch("/api/cv");
		if (res.ok) setSavedCvs(await res.json());
	};

	const stepStates: [StepState, StepState, StepState] = (() => {
		if (phase === "idle") return ["idle", "idle", "idle"];
		if (phase === "parsing") return ["active", "idle", "idle"];
		if (phase === "loading") return ["done", "active", "idle"];
		if (phase === "matching") return ["done", "done", "active"];
		return ["done", "done", "done"];
	})();

	const runMatching = async (cvJson: Record<string, unknown>) => {
		setPhase("loading");
		const internshipsRes = await fetch("/api/internships");
		const internships = await internshipsRes.json();
		setPhase("matching");
		if (Array.isArray(internships) && internships.length > 0) {
			try {
				const matchRes = await fetch("/api/match-cv-embedding", {
					method: "POST",
					headers: { "Content-Type": "application/json" },
					body: JSON.stringify({ cv: cvJson, internships }),
				});
				setMatches(await matchRes.json());
			} catch (err) {
				console.error("Matching error:", err);
				setMatchError("Gagal mencocokkan CV dengan lowongan.");
			}
		}
		setPhase("done");
	};

	const handleFile = async (selectedFile: File) => {
		if (selectedFile.size > 5 * 1024 * 1024) {
			alert("File maksimal 5MB");
			return;
		}
		setFile(selectedFile);
		setActiveCvId(null);
		setExpandedCvId(null);
		setActiveCvData(null);
		setPhase("parsing");
		setMatches([]);
		setMatchError(null);
		setMobileTab("match");

		try {
			const formData = new FormData();
			formData.append("file", selectedFile);
			const cvRes = await fetch("/api/parse-cv", {
				method: "POST",
				body: formData,
			});
			const cvData = await cvRes.json();

			let cvJson: CvData = {};
			try {
				cvJson = JSON.parse(cvData.ai);
			} catch {
				cvJson = { summary: cvData.rawText?.slice(0, 500) };
			}

			setActiveCvData(cvJson);

			if (user) {
				const res = await fetch("/api/cv", {
					method: "POST",
					headers: { "Content-Type": "application/json" },
					body: JSON.stringify({
						raw: cvJson,
						label: selectedFile.name.replace(/\.[^.]+$/, ""),
					}),
				});
				if (res.ok) {
					const saved: SavedCv = await res.json();
					setSavedCvs((prev) => [saved, ...prev]);
					setActiveCvId(saved.id);
					setExpandedCvId(saved.id);
				}
			} else {
				setShowSaveModal(true);
			}

			await runMatching(cvJson as Record<string, unknown>);
		} catch (err) {
			console.error(err);
			setPhase("done");
		}
	};

	const handleViewCv = (cv: SavedCv) => {
		setExpandedCvId((prev) => (prev === cv.id ? null : cv.id));
		if (expandedCvId !== cv.id) {
			setActiveCvData(cv.raw ?? null);
		}
	};

	const handleMatchCv = async (cv: SavedCv) => {
		if (phase !== "idle" && phase !== "done") return;
		setActiveCvId(cv.id);
		setExpandedCvId(cv.id);
		setActiveCvData(cv.raw ?? null);
		setFile(null);
		setMatches([]);
		setMatchError(null);
		setMobileTab("match");

		try {
			await runMatching((cv.raw ?? {}) as Record<string, unknown>);
		} catch (err) {
			console.error(err);
			setMatchError("Gagal mencocokkan CV dengan lowongan.");
			setPhase("done");
		}
	};

	const handleDeleteCv = async (id: string) => {
		const res = await fetch(`/api/cv/${id}`, { method: "DELETE" });
		if (res.ok) {
			setSavedCvs((prev) => prev.filter((cv) => cv.id !== id));
			if (activeCvId === id) {
				setActiveCvId(null);
				setActiveCvData(null);
				setPhase("idle");
				setMatches([]);
			}
			if (expandedCvId === id) setExpandedCvId(null);
		}
	};

	const handleRelabelCv = async (id: string, label: string) => {
		const res = await fetch(`/api/cv/${id}`, {
			method: "PATCH",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({ label }),
		});
		if (res.ok)
			setSavedCvs((prev) =>
				prev.map((cv) => (cv.id === id ? { ...cv, label } : cv)),
			);
	};

	const handleLogout = async () => {
		await fetch("/api/auth/logout", { method: "POST" });
		setUser(null);
		setSavedCvs([]);
		setActiveCvId(null);
		setExpandedCvId(null);
		setActiveCvData(null);
	};

	const onInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const f = e.target.files?.[0];
		if (f) handleFile(f);
	};

	const onDrop = (e: React.DragEvent) => {
		e.preventDefault();
		setDragging(false);
		const f = e.dataTransfer.files?.[0];
		if (f) handleFile(f);
	};

	const isProcessing = phase !== "idle" && phase !== "done";
	const [visibleCount, setVisibleCount] = useState(5);
	const topMatches = matches.filter((m) => m.score > 0);
	const zeroMatches = matches.filter((m) => m.score === 0);
	const allMatches = [...topMatches, ...zeroMatches];
	const visibleMatches = allMatches.slice(0, visibleCount);
	const hasMore = visibleCount < allMatches.length;
	const hasActivity = phase !== "idle";

	const uploadAreaLabel = isProcessing
		? "AI sedang memproses CV..."
		: activeCvId
			? "Upload CV baru"
			: file
				? file.name
				: "Pilih atau seret CV kamu";

	const uploadAreaSub = isProcessing
		? ""
		: activeCvId
			? "CV tersimpan sedang aktif · Upload untuk mengganti"
			: file
				? `${(file.size / 1024).toFixed(0)} KB · ${file.name.split(".").pop()?.toUpperCase()}`
				: "Format PDF atau DOCX · Maksimal 5MB";

	const BrowseSection = (
		<div>
			<div className="flex items-center gap-2.5 mb-5">
				<div className="w-10 h-10 sm:w-12 sm:h-12 bg-[#2563EB] rounded-[10px] flex items-center justify-center shrink-0">
					<svg
						width="18"
						height="18"
						viewBox="0 0 24 24"
						fill="none"
						stroke="#fff"
						strokeWidth="1.8"
						strokeLinecap="round"
						strokeLinejoin="round">
						<circle cx="11" cy="11" r="8" />
						<line x1="21" y1="21" x2="16.65" y2="16.65" />
					</svg>
				</div>
				<div>
					<h1 className="text-[15px] sm:text-[17px] font-medium tracking-[-0.3px] text-stone-900">
						Jelajahi Lowongan
					</h1>
					<p className="text-[11px] sm:text-[12px] text-stone-400">
						Semua lowongan · Talentern Tel-U
					</p>
				</div>
			</div>
			<InternshipBrowser />
		</div>
	);

	const MatchSection = (
		<div>
			<div className="flex items-center gap-2.5 mb-1">
				<div className="w-10 h-10 sm:w-12 sm:h-12 bg-blue-600 rounded-[10px] flex items-center justify-center shrink-0">
					<Image src="/logo.svg" width={500} height={500} alt="MagangMatch" />
				</div>
				<div>
					<h1 className="text-[15px] sm:text-[17px] font-medium tracking-[-0.3px] text-stone-900">
						MagangMatch
					</h1>
					<p className="text-[11px] sm:text-[12px] text-stone-400">
						Pencocok CV × Lowongan Magang · Telkom University
					</p>
				</div>
			</div>

			<div
				onClick={() => !isProcessing && fileInputRef.current?.click()}
				onDragOver={(e) => {
					e.preventDefault();
					setDragging(true);
				}}
				onDragLeave={() => setDragging(false)}
				onDrop={onDrop}
				className={`
          relative border-[1.5px] rounded-2xl p-8 sm:p-10 text-center cursor-pointer
          transition-all duration-200 my-5 sm:my-6
          ${isProcessing ? "cursor-not-allowed opacity-70" : ""}
          ${
											activeCvId
												? "border-dashed border-black/10 bg-white hover:border-blue-300 hover:bg-blue-50/30"
												: file
													? "border-solid border-blue-500 bg-blue-50"
													: dragging
														? "border-dashed border-blue-400 bg-blue-50"
														: "border-dashed border-black/12 bg-white hover:border-blue-400 hover:bg-blue-50"
										}
        `}>
				<input
					ref={fileInputRef}
					type="file"
					accept=".pdf,.docx"
					onChange={onInputChange}
					disabled={isProcessing}
					className="hidden"
					aria-label="Upload CV"
				/>

				<div
					className={`w-10 h-10 sm:w-11 sm:h-11 rounded-xl mx-auto mb-3.5 flex items-center justify-center transition-colors duration-200 ${(file && !activeCvId) || dragging ? "bg-blue-600" : "bg-stone-100"}`}>
					{isProcessing ? (
						<div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
					) : (
						<svg
							width="20"
							height="20"
							viewBox="0 0 24 24"
							fill="none"
							stroke={(file && !activeCvId) || dragging ? "white" : "#9B9B94"}
							strokeWidth="1.8"
							strokeLinecap="round"
							strokeLinejoin="round">
							<path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
							<polyline points="14 2 14 8 20 8" />
							<line x1="12" y1="12" x2="12" y2="18" />
							<line x1="9" y1="15" x2="15" y2="15" />
						</svg>
					)}
				</div>

				<p className="text-[13px] sm:text-[14px] font-medium text-stone-900 mb-1">
					{uploadAreaLabel}
				</p>
				<p className="text-[11px] sm:text-[12px] text-stone-400">{uploadAreaSub}</p>

				{!file && !activeCvId && (
					<div className="inline-flex items-center gap-1.5 mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg text-[12px] sm:text-[13px] font-medium pointer-events-none">
						<svg
							width="13"
							height="13"
							viewBox="0 0 24 24"
							fill="none"
							stroke="currentColor"
							strokeWidth="2.5"
							strokeLinecap="round"
							strokeLinejoin="round"
							aria-hidden="true">
							<path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
							<polyline points="17 8 12 3 7 8" />
							<line x1="12" y1="3" x2="12" y2="15" />
						</svg>
						Pilih File
					</div>
				)}

				{activeCvId && !isProcessing && (
					<div className="inline-flex items-center gap-1.5 mt-4 px-4 py-2 border border-black/10 text-stone-500 rounded-lg text-[12px] sm:text-[13px] font-medium pointer-events-none">
						<svg
							width="13"
							height="13"
							viewBox="0 0 24 24"
							fill="none"
							stroke="currentColor"
							strokeWidth="2"
							strokeLinecap="round"
							strokeLinejoin="round">
							<path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
							<polyline points="17 8 12 3 7 8" />
							<line x1="12" y1="3" x2="12" y2="15" />
						</svg>
						Ganti dengan CV Baru
					</div>
				)}
			</div>

			{hasActivity && <StepBar steps={stepStates} />}

			{hasActivity && (
				<div>
					<div className="flex items-end justify-between mb-3.5">
						<div>
							<h2 className="text-[13px] sm:text-[14px] font-medium text-stone-900">
								Lowongan yang Cocok
							</h2>
							<p className="text-[10px] sm:text-[11px] text-stone-400 mt-0.5">
								Berdasarkan kecocokan skill
							</p>
						</div>
						{phase === "done" && matches.length > 0 && (
							<span className="text-[10px] sm:text-[11px] font-medium px-2.5 py-1 rounded-full bg-blue-50 text-blue-600">
								{topMatches.length} cocok · {zeroMatches.length} lainnya
							</span>
						)}
					</div>

					{isProcessing && (
						<>
							<SkeletonCard />
							<SkeletonCard />
							<SkeletonCard />
							<SkeletonCard />
						</>
					)}

					{matchError && phase === "done" && (
						<div className="p-4 bg-red-50 border border-red-100 rounded-2xl text-[13px] text-red-600 mb-3">
							{matchError}
						</div>
					)}

					{phase === "done" &&
						visibleMatches.map((item, i) => {
							const isFirstZero =
								item.score === 0 && i > 0 && visibleMatches[i - 1].score > 0;
							return (
								<div key={i}>
									{isFirstZero && (
										<div className="flex items-center gap-3 my-4">
											<div className="flex-1 h-px bg-black/6" />
											<div className="flex-1 h-px bg-black/6" />
										</div>
									)}
									<MatchCard item={item} rank={i + 1} />
								</div>
							);
						})}

					{phase === "done" && hasMore && (
						<button
							onClick={() => setVisibleCount((v) => v + 5)}
							className="w-full mt-3 py-2.5 rounded-xl border border-black/10 bg-white text-[12px] sm:text-[13px] font-medium text-stone-600 hover:bg-stone-50 transition-all">
							Tampilkan 5 lagi ({allMatches.length - visibleCount} tersisa)
						</button>
					)}

					{phase === "done" && !hasMore && allMatches.length > 5 && (
						<button
							onClick={() => setVisibleCount(5)}
							className="w-full mt-3 py-2.5 rounded-xl border border-black/10 bg-white text-[12px] sm:text-[13px] font-medium text-stone-400 hover:bg-stone-50 transition-all">
							Sembunyikan
						</button>
					)}

					{phase === "done" && !matchError && matches.length === 0 && (
						<div className="p-10 bg-white border border-black/6 rounded-2xl text-center">
							<p className="text-[13px] text-stone-400">
								Tidak ada data lowongan yang berhasil dimuat.
							</p>
						</div>
					)}
				</div>
			)}
		</div>
	);

	const ProfileSection = (
		<div>
			<div className="flex items-center gap-2.5 mb-5">
				<div className="w-10 h-10 sm:w-12 sm:h-12 bg-[#2563EB] rounded-[10px] flex items-center justify-center shrink-0">
					<svg
						width="18"
						height="18"
						viewBox="0 0 24 24"
						fill="none"
						stroke="#fff"
						strokeWidth="1.8"
						strokeLinecap="round"
						strokeLinejoin="round">
						<path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
						<circle cx="12" cy="7" r="4" />
					</svg>
				</div>
				<div>
					<h1 className="text-[15px] sm:text-[17px] font-medium tracking-[-0.3px] text-stone-900">
						Profil
					</h1>
					<p className="text-[11px] sm:text-[12px] text-stone-400">
						Akun & CV tersimpan
					</p>
				</div>
			</div>

			{user ? (
				<ProfileCard
					user={user}
					savedCvs={savedCvs}
					onLogout={handleLogout}
					onDeleteCv={handleDeleteCv}
					onRelabelCv={handleRelabelCv}
					onViewCv={handleViewCv}
					onMatchCv={handleMatchCv}
					activeCvId={activeCvId}
					expandedCvId={expandedCvId}
				/>
			) : (
				<ProfileCardGuest />
			)}

			{activeCvData && (
				<div className="mt-3">
					<CvDetailPanel data={activeCvData} />
				</div>
			)}
		</div>
	);

	return (
		<div className="min-h-screen bg-stone-50 relative">
			{showSaveModal && <SaveCvModal onClose={() => setShowSaveModal(false)} />}

			<div className="hidden lg:block mx-auto px-6 py-8 pb-16">
				<div className="grid grid-cols-3 gap-10 items-start">
					<div>{BrowseSection}</div>
					<div>{MatchSection}</div>
					<div>{ProfileSection}</div>
				</div>
			</div>

			<div className="hidden md:block lg:hidden mx-auto px-5 py-6 pb-20 max-w-3xl">
				<div className="grid grid-cols-2 gap-6 items-start">
					<div>{BrowseSection}</div>
					<div className="space-y-6">
						{MatchSection}
						{ProfileSection}
					</div>
				</div>
			</div>

			<div className="block md:hidden">
				<div className="px-4 pt-5 pb-24">
					{mobileTab === "browse" && BrowseSection}
					{mobileTab === "match" && MatchSection}
					{mobileTab === "profile" && ProfileSection}
				</div>

				<nav className="fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-black/8 flex items-stretch">
					{(
						[
							{
								id: "browse" as MobileTab,
								label: "Jelajahi",
								icon: (active: boolean) => (
									<svg
										width="20"
										height="20"
										viewBox="0 0 24 24"
										fill="none"
										stroke={active ? "#2563EB" : "#9B9B94"}
										strokeWidth={active ? "2.2" : "1.8"}
										strokeLinecap="round"
										strokeLinejoin="round">
										<circle cx="11" cy="11" r="8" />
										<line x1="21" y1="21" x2="16.65" y2="16.65" />
									</svg>
								),
							},
							{
								id: "match" as MobileTab,
								label: "Match CV",
								icon: (active: boolean) => (
									<svg
										width="20"
										height="20"
										viewBox="0 0 24 24"
										fill="none"
										stroke={active ? "#2563EB" : "#9B9B94"}
										strokeWidth={active ? "2.2" : "1.8"}
										strokeLinecap="round"
										strokeLinejoin="round">
										<path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
										<polyline points="14 2 14 8 20 8" />
										<line x1="12" y1="12" x2="12" y2="18" />
										<line x1="9" y1="15" x2="15" y2="15" />
									</svg>
								),
							},
							{
								id: "profile" as MobileTab,
								label: "Profil",
								icon: (active: boolean) => (
									<svg
										width="20"
										height="20"
										viewBox="0 0 24 24"
										fill="none"
										stroke={active ? "#2563EB" : "#9B9B94"}
										strokeWidth={active ? "2.2" : "1.8"}
										strokeLinecap="round"
										strokeLinejoin="round">
										<path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
										<circle cx="12" cy="7" r="4" />
									</svg>
								),
							},
						] as const
					).map(({ id, label, icon }) => {
						const active = mobileTab === id;
						return (
							<button
								key={id}
								onClick={() => setMobileTab(id)}
								className={`flex-1 flex flex-col items-center justify-center gap-1 py-3 transition-colors ${active ? "text-blue-600" : "text-stone-400"}`}>
								{icon(active)}
								<span
									className={`text-[10px] font-medium ${active ? "text-blue-600" : "text-stone-400"}`}>
									{label}
								</span>
								{active && (
									<span
										className="absolute bottom-0 w-8 h-0.5 bg-blue-600 rounded-full"
										style={{ marginBottom: "env(safe-area-inset-bottom)" }}
									/>
								)}
							</button>
						);
					})}
				</nav>
			</div>

			<ChatBot isOpen={isChatOpen} onToggle={() => setIsChatOpen(!isChatOpen)} />
		</div>
	);
}
