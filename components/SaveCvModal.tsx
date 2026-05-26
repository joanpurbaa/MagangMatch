"use client";

import Link from "next/link";

interface SaveCvModalProps {
	onClose: () => void;
}

export default function SaveCvModal({ onClose }: SaveCvModalProps) {
	return (
		<div className="fixed inset-0 z-50 flex items-center justify-center px-4">
			<div
				className="absolute inset-0 bg-black/30 backdrop-blur-[2px]"
				onClick={onClose}
			/>
			<div className="relative bg-white rounded-2xl shadow-xl w-full max-w-sm p-6">
				<div className="w-11 h-11 bg-blue-50 rounded-xl flex items-center justify-center mb-4">
					<svg
						width="20"
						height="20"
						viewBox="0 0 24 24"
						fill="none"
						stroke="#3B82F6"
						strokeWidth="1.8"
						strokeLinecap="round"
						strokeLinejoin="round">
						<path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z" />
						<polyline points="17 21 17 13 7 13 7 21" />
						<polyline points="7 3 7 8 15 8" />
					</svg>
				</div>
				<p className="text-[15px] font-medium text-stone-900 mb-1">
					Simpan CV kamu?
				</p>
				<p className="text-[12px] text-stone-400 leading-relaxed mb-5">
					Buat akun gratis untuk menyimpan hasil analisis CV dan riwayat lowongan
					yang cocok.
				</p>
				<div className="flex gap-2">
					<Link
						href="/register"
						className="flex-1 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-[13px] font-medium transition-colors text-center">
						Daftar Sekarang
					</Link>
					<button
						onClick={onClose}
						className="flex-1 py-2.5 border border-black/10 text-stone-500 rounded-xl text-[13px] font-medium hover:bg-stone-50 transition-colors">
						Nanti Saja
					</button>
				</div>
			</div>
		</div>
	);
}
