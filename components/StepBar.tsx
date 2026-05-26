type StepState = "idle" | "active" | "done";

export default function StepBar({
	steps,
}: {
	steps: [StepState, StepState, StepState];
}) {
	const labels = ["Ekstraksi CV", "Muat Lowongan", "Pencocokan"];

	const activeIdx = steps.findIndex((s) => s === "active");
	const doneCount = steps.filter((s) => s === "done").length;
	const mobileIdx = activeIdx >= 0 ? activeIdx : Math.max(0, doneCount - 1);
	const mobileState = steps[mobileIdx];

	return (
		<div className="bg-white border border-black/8 rounded-2xl px-5 py-3.5 mb-7">
			<div className="hidden md:flex items-center justify-center">
				{labels.map((label, i) => (
					<div key={label} className="flex items-center">
						<div className="flex items-center gap-2">
							<div
								className={`
                  w-5.5 h-5.5 rounded-full border-[1.5px] flex items-center justify-center
                  text-[11px] font-medium shrink-0 font-mono transition-all duration-300
                  ${
																			steps[i] === "done"
																				? "bg-green-100 border-green-300 text-green-700"
																				: steps[i] === "active"
																					? "bg-blue-50 border-blue-500 text-blue-600"
																					: "bg-white border-black/[0.14] text-stone-400"
																		}
                `}>
								{steps[i] === "done" ? "✓" : i + 1}
							</div>
							<span
								className={`
                  text-[12px] whitespace-nowrap transition-colors duration-300
                  ${
																			steps[i] === "done"
																				? "text-green-700 font-medium"
																				: steps[i] === "active"
																					? "text-blue-600 font-medium"
																					: "text-stone-400"
																		}
                `}>
								{label}
							</span>
						</div>
						{i < labels.length - 1 && <div className="w-20 h-px bg-black/8 mx-4" />}
					</div>
				))}
			</div>

			<div className="flex md:hidden flex-col items-center gap-2">
				<div className="flex items-center gap-2">
					<div
						className={`
              w-5.5 h-5.5 rounded-full border-[1.5px] flex items-center justify-center
              text-[11px] font-medium shrink-0 font-mono transition-all duration-300
              ${
															mobileState === "done"
																? "bg-green-100 border-green-300 text-green-700"
																: mobileState === "active"
																	? "bg-blue-50 border-blue-500 text-blue-600"
																	: "bg-white border-black/[0.14] text-stone-400"
														}
            `}>
						{mobileState === "done" ? "✓" : mobileIdx + 1}
					</div>
					<span
						className={`
              text-[12px] font-medium transition-colors duration-300
              ${
															mobileState === "done"
																? "text-green-700"
																: mobileState === "active"
																	? "text-blue-600"
																	: "text-stone-400"
														}
            `}>
						{labels[mobileIdx]}
					</span>
				</div>

				<div className="flex items-center gap-1.5">
					{steps.map((s, i) => (
						<div
							key={i}
							className={`
                h-1 rounded-full transition-all duration-300
                ${
																	i === mobileIdx
																		? "w-4 bg-blue-500"
																		: s === "done"
																			? "w-1.5 bg-green-400"
																			: "w-1.5 bg-black/10"
																}
              `}
						/>
					))}
				</div>
			</div>
		</div>
	);
}
