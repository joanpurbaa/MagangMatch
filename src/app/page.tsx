import Image from "next/image";
import Link from "next/link";
import {
	FileText,
	Search,
	Sparkles,
	Target,
	Zap,
	BadgeCheck,
	Building2,
	GraduationCap,
} from "lucide-react";

export default function Home() {
	return (
		<div className="min-h-screen bg-[#fafaf8] font-sans text-[#0f1117] overflow-x-hidden">
			<nav className="sticky top-0 z-50 h-14 md:h-16 w-full border-b border-neutral-200 bg-white">
				<div className="mx-auto flex h-full max-w-7xl items-center justify-between px-4 md:px-8">
					<Link href="/" className="flex items-center gap-3 no-underline">
						<Image
							src="/logo.svg"
							alt="Logo"
							width={30}
							height={30}
							className="object-contain md:w-8.5 md:h-8.5"
						/>
					</Link>

					<div className="flex items-center gap-1.5 md:gap-2">
						<Link
							href="/login"
							className="rounded-lg md:rounded-xl px-3 md:px-4 py-1.5 md:py-2 text-[13px] md:text-[14px] font-medium text-neutral-700 transition-all hover:bg-neutral-100 no-underline">
							Masuk
						</Link>

						<Link
							href="/register"
							className="rounded-lg md:rounded-xl bg-blue-600 px-3.5 md:px-5 py-2 md:py-2.5 text-[13px] md:text-[14px] font-semibold text-white transition-all hover:bg-blue-700 hover:shadow-md no-underline">
							Daftar Gratis
						</Link>
					</div>
				</div>
			</nav>

			<section className="max-w-5xl mx-auto px-4 md:px-16 pt-12 md:pt-20 pb-10 md:pb-16 text-center">
				<h1 className="text-[clamp(32px,9vw,80px)] leading-[1.08] tracking-[-1.5px] md:tracking-[-2px] font-light text-[#0f1117] mb-4 md:mb-6 font-serif">
					Cari, Cocokan <em className="italic text-blue-600">CV,</em>{" "}
					<br className="hidden sm:block" />
					dan temukan <em className="italic text-blue-600">magang</em>
					<br className="hidden sm:block" />
					yang relevan
				</h1>

				<p className="text-[15px] md:text-[17px] text-neutral-500 leading-relaxed max-w-130 mx-auto mb-8 md:mb-10 px-1">
					Upload CV-mu sekali. AI kami analisis dalam 30 detik dan cocokkan dengan
					lowongan — lengkap dengan skor kecocokan 0–100%.
				</p>

				<div className="flex flex-col sm:flex-row items-center justify-center gap-3 mb-12 md:mb-16 px-2">
					<Link
						href="/dashboard"
						className="w-full sm:w-auto text-[14px] md:text-[15px] font-semibold text-white bg-blue-600 px-7 py-3.5 rounded-xl hover:bg-blue-700 hover:-translate-y-0.5 transition-all shadow-[0_4px_20px_rgba(37,99,235,0.3)] hover:shadow-[0_8px_28px_rgba(37,99,235,0.35)] no-underline text-center">
						Mulai Sekarang — Gratis
					</Link>
					<a
						href="#cara-kerja"
						className="w-full sm:w-auto text-[14px] md:text-[15px] font-semibold text-[#0f1117] bg-white border border-black/10 px-7 py-3.5 rounded-xl hover:border-black/30 hover:-translate-y-0.5 transition-all no-underline text-center">
						Lihat Cara Kerja
					</a>
				</div>
			</section>

			<section
				id="cara-kerja"
				className="max-w-5xl mx-auto px-4 md:px-16 py-12 md:py-20">
				<p className="text-[11px] md:text-[12px] font-bold tracking-widest uppercase text-blue-600 mb-3">
					Cara kerja
				</p>
				<h2 className="text-[clamp(24px,5vw,48px)] font-light tracking-[-1px] leading-[1.1] text-[#0f1117] mb-3 md:mb-4 font-serif">
					Tiga langkah,
					<br />
					satu tujuan.
				</h2>
				<p className="text-[14px] md:text-[16px] text-neutral-500 leading-relaxed max-w-120 mb-10 md:mb-14">
					Tidak perlu isi form panjang atau daftar akun dulu. Cukup upload CV dan
					biarkan AI yang bekerja.
				</p>

				<div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
					{[
						{
							num: "01",
							icon: FileText,
							title: "Ekstraksi CV",
							desc:
								"Upload CV PDF-mu. AI kami baca dan ekstrak skill, pengalaman, serta role yang paling sesuai denganmu secara otomatis.",
						},
						{
							num: "02",
							icon: Search,
							title: "Muat Lowongan",
							desc:
								"Kami kumpulkan banyak kesempatan dari berbagai perusahaan — real-time, setiap hari diperbarui.",
						},
						{
							num: "03",
							icon: Sparkles,
							title: "Pencocokan",
							desc:
								"Setiap lowongan dapat skor kecocokan 0–100% khusus buat kamu. Fokus melamar yang paling relevan, hemat waktu.",
						},
					].map((step) => (
						<div
							key={step.num}
							className="group bg-white border border-black/8 rounded-2xl p-5 md:p-7 hover:border-blue-200 hover:-translate-y-1 transition-all relative overflow-hidden">
							<div className="absolute top-0 left-0 right-0 h-0.75 bg-linear-to-r from-blue-500 to-blue-300 opacity-0 group-hover:opacity-100 transition-opacity" />
							<p className="text-[11px] font-bold tracking-[0.08em] text-neutral-300 mb-3 md:mb-4">
								{step.num}
							</p>
							<div className="w-10 h-10 md:w-11 md:h-11 rounded-xl bg-blue-50 flex items-center justify-center mb-3 md:mb-4">
								<step.icon
									className="w-4.5 h-4.5 md:w-5 md:h-5 text-blue-600"
									strokeWidth={2.2}
								/>
							</div>
							<h3 className="text-[15px] md:text-[16px] font-bold text-[#0f1117] mb-1.5 md:mb-2">
								{step.title}
							</h3>
							<p className="text-[13px] md:text-[14px] text-neutral-500 leading-relaxed">
								{step.desc}
							</p>
						</div>
					))}
				</div>
			</section>

			<section className="max-w-5xl mx-auto px-4 md:px-16 py-12 md:py-20">
				<p className="text-[11px] md:text-[12px] font-bold tracking-widest uppercase text-blue-600 mb-3">
					Kenapa kami
				</p>
				<h2 className="text-[clamp(24px,5vw,48px)] font-light tracking-[-1px] leading-[1.1] text-[#0f1117] mb-3 md:mb-4 font-serif">
					Bukan sekadar
					<br />
					job board biasa.
				</h2>
				<p className="text-[14px] md:text-[16px] text-neutral-500 leading-relaxed max-w-120 mb-10 md:mb-14">
					Platform lain tampilkan daftar lowongan. Kami tampilkan lowongan yang
					memang cocok untuk <em>kamu</em>.
				</p>

				<div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-5">
					<div className="md:col-span-2 bg-[#0f1117] rounded-2xl p-6 md:p-8 flex flex-col md:flex-row items-start md:items-center gap-6 md:gap-8">
						<div className="flex-1">
							<div className="w-11 h-11 md:w-12 md:h-12 rounded-2xl bg-blue-500/10 flex items-center justify-center mb-3 md:mb-4">
								<Target className="w-5 h-5 md:w-6 md:h-6 text-blue-400" />
							</div>
							<h3 className="text-[18px] md:text-[20px] font-bold text-white mb-2">
								Skor kecocokan personal
							</h3>
							<p className="text-[13px] md:text-[14px] text-white leading-relaxed max-w-lg">
								Bukan algoritma generik. Model kami pelajari profilmu dari CV dan kasih
								skor unik per lowongan — bukan ranking massal yang sama untuk semua
								orang.
							</p>
						</div>
						<div className="shrink-0 w-24 h-24 md:w-28 md:h-28 rounded-full border border-blue-400 flex flex-col items-center justify-center">
							<span className="text-[32px] md:text-[36px] font-extrabold text-blue-400 leading-none">
								92
							</span>
							<span className="text-[10px] md:text-[11px] text-blue-400 font-medium">
								match score
							</span>
						</div>
					</div>

					{[
						{
							icon: Zap,
							title: "Analisis 30 detik",
							desc:
								"Tidak perlu tunggu lama. CV diproses dan rekomendasi muncul dalam hitungan detik.",
						},
						{
							icon: BadgeCheck,
							title: "Gratis, tanpa syarat",
							desc:
								"Tidak perlu daftar untuk memulai. Upload langsung, hasil langsung. Akun opsional.",
						},
						{
							icon: Building2,
							title: "20+ perusahaan",
							desc: "Dari startup hingga korporat — semua diverifikasi.",
						},
						{
							icon: GraduationCap,
							title: "Dibuat untuk Mahasiswa",
							desc:
								"Memudahkan mahasiswa untuk mencari magang dengan sumber Talentern",
						},
					].map((f) => (
						<div
							key={f.title}
							className="bg-white border border-black/8 rounded-2xl p-5 md:p-7 hover:border-blue-200 transition-colors">
							<div className="w-10 h-10 md:w-11 md:h-11 rounded-xl bg-blue-50 flex items-center justify-center mb-3 md:mb-4">
								<f.icon
									className="w-4.5 h-4.5 md:w-5 md:h-5 text-blue-600"
									strokeWidth={2.2}
								/>
							</div>
							<h3 className="text-[15px] md:text-[16px] font-bold text-[#0f1117] mb-1.5 md:mb-2">
								{f.title}
							</h3>
							<p className="text-[13px] md:text-[14px] text-neutral-500 leading-relaxed">
								{f.desc}
							</p>
						</div>
					))}
				</div>
			</section>

			<section className="mx-4 md:mx-16 mb-12 md:mb-20">
				<div className="bg-[#0f1117] rounded-2xl md:rounded-3xl px-6 md:px-20 py-12 md:py-16 text-center relative overflow-hidden">
					<div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_0%,rgba(37,99,235,0.3),transparent_65%)] pointer-events-none" />
					<h2 className="text-[clamp(24px,6vw,54px)] font-light tracking-[-1px] text-white mb-3 md:mb-4 font-serif relative">
						Siap cari magang
						<br />
						yang benar-benar cocok?
					</h2>
					<p className="text-[14px] md:text-[16px] text-white max-w-md mx-auto mb-7 md:mb-9 leading-relaxed relative">
						Perusahaan banyak menunggu. Upload CV-mu sekarang dan lihat mana yang
						paling sesuai — gratis.
					</p>
					<div className="flex flex-col sm:flex-row gap-3 justify-center relative px-2">
						<Link
							href="/dashboard"
							className="w-full sm:w-auto text-[14px] md:text-[15px] font-semibold text-[#0f1117] bg-white px-7 py-3.5 rounded-xl hover:opacity-90 hover:-translate-y-0.5 transition-all no-underline text-center">
							Mulai Sekarang
						</Link>
						<Link
							href="/login"
							className="w-full sm:w-auto text-[14px] md:text-[15px] font-semibold text-white/60 border border-white/15 px-7 py-3.5 rounded-xl hover:border-white/40 hover:text-white transition-all no-underline text-center">
							Sudah punya akun? Masuk
						</Link>
					</div>
				</div>
			</section>
		</div>
	);
}
