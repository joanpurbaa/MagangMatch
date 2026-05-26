export default function SectionLabel({
	icon,
	text,
}: {
	icon: React.ReactNode;
	text: string;
}) {
	return (
		<div className="flex items-center gap-1.5 mb-2.5">
			<span className="text-stone-400">{icon}</span>
			<span className="text-[10px] font-semibold text-stone-400 uppercase tracking-[0.07em]">
				{text}
			</span>
		</div>
	);
}
