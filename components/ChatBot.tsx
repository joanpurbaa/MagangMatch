"use client";

import { useState, useRef, useEffect } from "react";

interface Message {
	id: string;
	text: string;
	sender: "user" | "bot";
	timestamp: Date;
}

interface ChatBotProps {
	isOpen: boolean;
	onToggle: () => void;
}

export default function ChatBot({ isOpen, onToggle }: ChatBotProps) {
	const [messages, setMessages] = useState<Message[]>([
		{
			id: "1",
			text:
				"Halo! 👋 Saya asisten magang FIT Telkom University. Ada yang bisa saya bantu? (Instagram magang, durasi magang, persyaratan, dll)",
			sender: "bot",
			timestamp: new Date(),
		},
	]);
	const [inputValue, setInputValue] = useState("");
	const [isLoading, setIsLoading] = useState(false);
	const messagesEndRef = useRef<HTMLDivElement>(null);
	const inputRef = useRef<HTMLInputElement>(null);

	useEffect(() => {
		if (isOpen) {
			messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
			inputRef.current?.focus();
		}
	}, [messages, isOpen]);

	const sendMessage = async () => {
		if (!inputValue.trim() || isLoading) return;
		const userMessage: Message = {
			id: Date.now().toString(),
			text: inputValue,
			sender: "user",
			timestamp: new Date(),
		};
		setMessages((prev) => [...prev, userMessage]);
		setInputValue("");
		setIsLoading(true);
		try {
			const response = await fetch(
				`/api/chat-bot?q=${encodeURIComponent(inputValue)}`,
			);
			const data = await response.json();
			setMessages((prev) => [
				...prev,
				{
					id: (Date.now() + 1).toString(),
					text:
						data.answer || "Maaf, saya tidak bisa menjawab pertanyaan itu saat ini.",
					sender: "bot",
					timestamp: new Date(),
				},
			]);
		} catch {
			setMessages((prev) => [
				...prev,
				{
					id: (Date.now() + 1).toString(),
					text: "Maaf, terjadi kesalahan. Silakan coba lagi nanti.",
					sender: "bot",
					timestamp: new Date(),
				},
			]);
		} finally {
			setIsLoading(false);
		}
	};

	const handleKeyPress = (e: React.KeyboardEvent) => {
		if (e.key === "Enter" && !e.shiftKey) {
			e.preventDefault();
			sendMessage();
		}
	};

	const formatTime = (date: Date) =>
		date.toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" });

	return (
		<>
			<button
				onClick={onToggle}
				className="fixed bottom-20 md:bottom-5 right-5 z-50 w-13 h-13 bg-blue-600 rounded-full shadow-lg shadow-blue-500/25 hover:bg-blue-700 transition-all duration-200 flex items-center justify-center"
				style={{ width: 52, height: 52 }}
				aria-label="Chat dengan asisten magang">
				{isOpen ? (
					<svg
						width="20"
						height="20"
						viewBox="0 0 24 24"
						fill="none"
						stroke="white"
						strokeWidth="2.5"
						strokeLinecap="round"
						strokeLinejoin="round">
						<line x1="18" y1="6" x2="6" y2="18" />
						<line x1="6" y1="6" x2="18" y2="18" />
					</svg>
				) : (
					<svg
						width="22"
						height="22"
						viewBox="0 0 24 24"
						fill="none"
						stroke="white"
						strokeWidth="2"
						strokeLinecap="round"
						strokeLinejoin="round">
						<path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
					</svg>
				)}
				<span className="absolute -top-0.5 -right-0.5 w-3 h-3 bg-green-400 rounded-full border-2 border-stone-100" />
			</button>

			<div
				className={`
        fixed bottom-18 right-5 z-50 w-80 bg-white rounded-2xl shadow-xl border border-black/8
        flex flex-col overflow-hidden transition-all duration-300 ease-in-out
        ${isOpen ? "opacity-100 scale-100 pointer-events-auto" : "opacity-0 scale-95 pointer-events-none"}
      `}
				style={{ height: 460 }}>
				{/* Header */}
				<div className="bg-blue-600 text-white px-4 py-3.5 flex items-center justify-between shrink-0">
					<div className="flex items-center gap-2.5">
						<div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
							<svg
								width="16"
								height="16"
								viewBox="0 0 24 24"
								fill="none"
								stroke="white"
								strokeWidth="2"
								strokeLinecap="round"
								strokeLinejoin="round">
								<path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
							</svg>
						</div>
						<div>
							<p className="font-medium text-[13px] leading-tight">
								Asisten Magang FIT
							</p>
							<p className="text-[10px] text-blue-100">Online · Siap membantu</p>
						</div>
					</div>
					<button
						onClick={onToggle}
						className="p-1 hover:bg-white/20 rounded-lg transition-colors">
						<svg
							width="16"
							height="16"
							viewBox="0 0 24 24"
							fill="none"
							stroke="currentColor"
							strokeWidth="2.5"
							strokeLinecap="round"
							strokeLinejoin="round">
							<line x1="18" y1="6" x2="6" y2="18" />
							<line x1="6" y1="6" x2="18" y2="18" />
						</svg>
					</button>
				</div>

				{/* Messages */}
				<div className="flex-1 overflow-y-auto p-4 space-y-3 bg-stone-50">
					{messages.map((message) => (
						<div
							key={message.id}
							className={`flex ${message.sender === "user" ? "justify-end" : "justify-start"}`}>
							<div
								className={`max-w-[82%] ${
									message.sender === "user"
										? "bg-blue-600 text-white rounded-[14px_4px_14px_14px]"
										: "bg-white border border-black/8 text-stone-800 rounded-[4px_14px_14px_14px]"
								} px-3.5 py-2.5`}>
								<p className="text-[12px] leading-relaxed whitespace-pre-wrap">
									{message.text}
								</p>
								<span
									className={`text-[10px] mt-1 block ${message.sender === "user" ? "text-blue-100 text-right" : "text-stone-400"}`}>
									{formatTime(message.timestamp)}
								</span>
							</div>
						</div>
					))}
					{isLoading && (
						<div className="flex justify-start">
							<div className="bg-white border border-black/8 rounded-[4px_14px_14px_14px] px-4 py-3 flex items-center gap-1.5">
								{[0, 150, 300].map((d) => (
									<div
										key={d}
										className="w-1.5 h-1.5 bg-stone-400 rounded-full animate-bounce"
										style={{ animationDelay: `${d}ms` }}
									/>
								))}
							</div>
						</div>
					)}
					<div ref={messagesEndRef} />
				</div>

				{/* Input */}
				<div className="p-3.5 border-t border-black/6 bg-white shrink-0">
					<div className="flex gap-2">
						<input
							ref={inputRef}
							type="text"
							value={inputValue}
							onChange={(e) => setInputValue(e.target.value)}
							onKeyPress={handleKeyPress}
							placeholder="Tanyakan tentang magang FIT..."
							disabled={isLoading}
							className="flex-1 px-3.5 py-2 border border-black/12 rounded-xl text-[12px] focus:outline-none focus:border-blue-400 disabled:bg-stone-50 placeholder:text-stone-300"
						/>
						<button
							onClick={sendMessage}
							disabled={!inputValue.trim() || isLoading}
							className="px-3.5 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors disabled:opacity-40 disabled:cursor-not-allowed">
							<svg
								width="15"
								height="15"
								viewBox="0 0 24 24"
								fill="none"
								stroke="currentColor"
								strokeWidth="2.5"
								strokeLinecap="round"
								strokeLinejoin="round">
								<line x1="22" y1="2" x2="11" y2="13" />
								<polygon points="22 2 15 22 11 13 2 9 22 2" />
							</svg>
						</button>
					</div>
					<p className="text-[10px] text-stone-300 mt-2 text-center">
						Tanya: durasi magang, persyaratan, instagram, kontak, dll.
					</p>
				</div>
			</div>
		</>
	);
}
