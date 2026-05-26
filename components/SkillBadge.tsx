export default function SkillBadge({ label }: { label: string }) {
	return (
		<span className="text-[11px] px-2 py-0.5 rounded-md bg-blue-50 text-blue-700 border border-blue-200/60 font-medium">
			{label}
		</span>
	);
}
