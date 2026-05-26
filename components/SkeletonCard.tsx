export default function SkeletonCard() {
	return (
		<div className="bg-white border border-black/[0.08] rounded-2xl p-4 flex gap-4 mb-3 animate-pulse">
			<div className="w-12 h-16 rounded-xl bg-stone-100 shrink-0" />
			<div className="flex-1 space-y-3 pt-1">
				<div className="h-3.5 bg-stone-100 rounded w-[55%]" />
				<div className="h-3 bg-stone-100 rounded w-[38%]" />
				<div className="flex gap-1.5">
					<div className="h-5 w-16 bg-stone-100 rounded-md" />
					<div className="h-5 w-20 bg-stone-100 rounded-md" />
					<div className="h-5 w-14 bg-stone-100 rounded-md" />
				</div>
			</div>
		</div>
	);
}
