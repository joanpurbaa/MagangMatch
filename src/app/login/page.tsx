"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";

export default function LoginPage() {
	const router = useRouter();
	const [form, setForm] = useState({ email: "", password: "" });
	const [error, setError] = useState<string | null>(null);
	const [loading, setLoading] = useState(false);

	const handleChange = (e: React.ChangeEvent<HTMLInputElement>) =>
		setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));

	const handleSubmit = async (e: React.MouseEvent) => {
		e.preventDefault();
		setError(null);
		setLoading(true);
		const res = await fetch("/api/auth/login", {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify(form),
		});
		const data = await res.json();
		setLoading(false);
		if (!res.ok) {
			setError(data.error ?? "Login gagal.");
			return;
		}
		router.push("/");
	};

	return (
		<div className="min-h-screen bg-stone-50 flex items-center justify-center px-4">
			<div className="w-full max-w-sm">
				{/* Logo */}
				<div className="flex items-center gap-2.5 mb-8">
					<div className="w-10 h-10 bg-blue-600 rounded-[10px] flex items-center justify-center shrink-0">
						<Image src="/logo.svg" width={24} height={24} alt="Logo" />
					</div>
					<div>
						<p className="text-[15px] font-medium tracking-[-0.3px] text-stone-900">
							MagangMatch
						</p>
						<p className="text-[11px] text-stone-400">Masuk ke akun kamu</p>
					</div>
				</div>

				<div className="bg-white border border-black/8 rounded-2xl p-6">
					<h1 className="text-[17px] font-medium text-stone-900 mb-1">Masuk</h1>
					<p className="text-[12px] text-stone-400 mb-6">
						Belum punya akun?{" "}
						<Link
							href="/register"
							className="text-blue-600 hover:underline font-medium">
							Daftar di sini
						</Link>
					</p>

					{error && (
						<div className="mb-4 p-3 bg-red-50 border border-red-100 rounded-xl text-[12px] text-red-600">
							{error}
						</div>
					)}

					<div className="space-y-3 mb-5">
						{[
							{
								name: "email",
								label: "Email",
								type: "email",
								placeholder: "budi@student.telkomuniversity.ac.id",
							},
							{
								name: "password",
								label: "Password",
								type: "password",
								placeholder: "••••••••",
							},
						].map(({ name, label, type, placeholder }) => (
							<div key={name}>
								<label className="block text-[11px] font-medium text-stone-500 mb-1.5">
									{label}
								</label>
								<input
									name={name}
									type={type}
									value={form[name as keyof typeof form]}
									onChange={handleChange}
									placeholder={placeholder}
									className="w-full px-3.5 py-2.5 rounded-xl border border-black/12 text-[13px] text-stone-900 placeholder:text-stone-300 focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-50 transition-all"
								/>
							</div>
						))}
					</div>

					<button
						onClick={handleSubmit}
						disabled={loading}
						className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 disabled:opacity-60 text-white rounded-xl text-[13px] font-medium transition-colors">
						{loading ? "Memproses..." : "Masuk"}
					</button>
				</div>
			</div>
		</div>
	);
}
