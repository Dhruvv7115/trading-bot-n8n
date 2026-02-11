export interface FeatureCardType {
	title: string;
	description: string;
	icon: React.ReactElement;
}

export function FeatureCard({
	icon,
	title,
	description,
}: {
	icon: React.ReactNode;
	title: string;
	description: string;
}) {
	return (
		<div className="p-6 rounded-2xl bg-card dark:bg-background text-card-foreground dark:border border-border transition-colors relative z-10">
			<div className="w-12 h-12 rounded-xl bg-secondary flex items-center justify-center mb-4 text-primary">
				{icon}
			</div>
			<h3 className="text-xl font-semibold mb-2">{title}</h3>
			<p className="text-muted-foreground">{description}</p>
		</div>
	);
}
