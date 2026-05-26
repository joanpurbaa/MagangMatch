"use client";

import { useState, useEffect } from "react";
import { CvData } from "@/app/types/types";

interface CvEditModalProps {
	raw: string;
	onConfirm: (data: CvData) => void;
	onClose: () => void;
}

export default function CvEditModal({
	raw,
	onConfirm,
	onClose,
}: CvEditModalProps) {
	const [data, setData] = useState<CvData>({});

	useEffect(() => {
		try {
			// eslint-disable-next-line react-hooks/set-state-in-effect
			setData(JSON.parse(raw));
		} catch {
			setData({});
		}
	}, [raw]);

	const set = (key: keyof CvData, value: unknown) =>
		setData((prev) => ({ ...prev, [key]: value }));

	const skillsFlat = (() => {
		if (!data.skills) return "";
		if (Array.isArray(data.skills)) return data.skills.join(", ");
		return Object.values(data.skills).flat().join(", ");
	})();

	const handleSkillsChange = (val: string) => {
		set(
			"skills",
			val
				.split(",")
				.map((s) => s.trim())
				.filter(Boolean),
		);
	};

	return (
		<div className="fixed inset-0 z-50 flex items-center justify-center px-4">
			<div
				className="absolute inset-0 bg-black/30 backdrop-blur-[2px]"
				onClick={onClose}
			/>
			<div className="relative bg-white rounded-2xl shadow-xl w-full max-w-md max-h-[85vh] overflow-y-auto">
				{/* Header */}
				<div className="sticky top-0 bg-white border-b border-black/6 px-5 py-4 flex items-center justify-between rounded-t-2xl z-10">
					<div>
						<p className="text-[14px] font-medium text-stone-900">Cek Data CV</p>
						<p className="text-[11px] text-stone-400">Koreksi sebelum disimpan</p>
					</div>
					<button
						onClick={onClose}
						className="w-7 h-7 rounded-lg flex items-center justify-center hover:bg-stone-100 transition-colors">
						<svg
							width="14"
							height="14"
							viewBox="0 0 24 24"
							fill="none"
							stroke="#9B9B94"
							strokeWidth="2.5"
							strokeLinecap="round"
							strokeLinejoin="round">
							<line x1="18" y1="6" x2="6" y2="18" />
							<line x1="6" y1="6" x2="18" y2="18" />
						</svg>
					</button>
				</div>

				{/* Fields */}
				<div className="px-5 py-4 space-y-4">
					{[
						{
							label: "Nama Lengkap",
							key: "name",
							type: "text",
							placeholder: "Nama kamu",
						},
						{
							label: "Email",
							key: "email",
							type: "email",
							placeholder: "email@example.com",
						},
						{ label: "No. HP", key: "phone", type: "text", placeholder: "+62..." },
						{ label: "Kota", key: "location", type: "text", placeholder: "Bandung" },
						{
							label: "LinkedIn",
							key: "linkedin",
							type: "text",
							placeholder: "linkedin.com/in/...",
						},
						{
							label: "GitHub",
							key: "github",
							type: "text",
							placeholder: "github.com/...",
						},
					].map(({ label, key, type, placeholder }) => (
						<Field key={key} label={label}>
							<input
								type={type}
								value={(data[key as keyof CvData] as string) ?? ""}
								onChange={(e) => set(key as keyof CvData, e.target.value)}
								placeholder={placeholder}
								className={inputCls}
							/>
						</Field>
					))}
					<Field label="Ringkasan / Summary">
						<textarea
							value={data.summary ?? ""}
							onChange={(e) => set("summary", e.target.value)}
							rows={3}
							className={inputCls + " resize-none"}
							placeholder="Ceritakan tentang dirimu..."
						/>
					</Field>
					<Field label="Skills (pisahkan dengan koma)">
						<textarea
							value={skillsFlat}
							onChange={(e) => handleSkillsChange(e.target.value)}
							rows={2}
							className={inputCls + " resize-none"}
							placeholder="React, Node.js, Python..."
						/>
					</Field>
				</div>

				{/* Footer */}
				<div className="sticky bottom-0 bg-white border-t border-black/6 px-5 py-4 flex gap-2 rounded-b-2xl">
					<button
						onClick={onClose}
						className="flex-1 py-2.5 rounded-xl border border-black/10 text-[13px] font-medium text-stone-500 hover:bg-stone-50 transition-colors">
						Batal
					</button>
					<button
						onClick={() => onConfirm(data)}
						className="flex-1 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-[13px] font-medium transition-colors">
						Simpan CV
					</button>
				</div>
			</div>
		</div>
	);
}

function Field({
	label,
	children,
}: {
	label: string;
	children: React.ReactNode;
}) {
	return (
		<div>
			<label className="block text-[11px] font-medium text-stone-500 mb-1.5">
				{label}
			</label>
			{children}
		</div>
	);
}

const inputCls =
	"w-full px-3.5 py-2.5 rounded-xl border border-black/[0.12] text-[13px] text-stone-900 placeholder:text-stone-300 focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-50 transition-all";
