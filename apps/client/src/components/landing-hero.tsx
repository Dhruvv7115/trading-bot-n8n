import { ArrowRight, Bot, Shield, Zap } from "lucide-react";
import { Link } from "react-router-dom";
import { FeatureCard, type FeatureCardType } from "./feature-card";
import MacApp from "./mac-app";
import { motion } from "motion/react";
import { useState } from "react";
import { HeroScrollDemo } from "./hero-scroll";
const featuredCards: FeatureCardType[] = [
	{
		icon: <Zap className="w-6 h-6 text-primary" />,
		title: "Lightning Fast",
		description:
			"Execute trades in milliseconds with our optimized execution engine.",
	},
	{
		icon: <Bot className="w-6 h-6 text-primary" />,
		title: "Visual Builder",
		description:
			"Drag and drop nodes to create complex trading logic without writing code.",
	},
	{
		icon: <Shield className="w-6 h-6 text-primary" />,
		title: "Secure & Reliable",
		description:
			"Enterprise-grade security for your API keys and execution environments.",
	},
];

export default function LandingHero() {
	const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);
	return (
		<main className="relative pt-32 pb-20 px-6 overflow-hidden">
			<div className="absolute top-20 left-1/2 -translate-x-1/2 w-[500px] h-[500px] bg-primary/20 rounded-full blur-[100px] -z-10" />

			<div className="container mx-auto text-center max-w-4xl mb-6">
				<h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-8 bg-linear-to-br from-foreground via-foreground/90 to-muted-foreground bg-clip-text text-transparent text-balance drop-shadow-[1px_1px_10px_rgba(0,0,0,0.4)] dark:drop-shadow-[1px_1px_10px_rgba(255,255,255,0.4)]">
					Automate your trading strategies with ease.
				</h1>
				<p className="text-sm md:text-lg text-muted-foreground mb-10 md:max-w-lg max-w-sm mx-auto leading-relaxed">
					Build, test, and deploy powerful trading bots using our intuitive
					visual workflow builder. No coding required.
				</p>

				<div className="flex flex-col sm:flex-row items-center justify-center gap-4">
					<Link
						to="/signup"
						className="group flex items-center justify-center gap-4 bg-background/20 px-6 py-3 border border-border rounded-lg backdrop-blur-2xl hover:bg-secondary/40 hover:ring-4 ring-secondary"
					>
						Start Building
						<ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
					</Link>
				</div>
			</div>
			{/* <MacApp /> */}
			<HeroScrollDemo />

			{/* Feature Grid */}
			<div className="container mx-auto mt-32 grid md:grid-cols-3 gap-6">
				{featuredCards.map(
					({ title, icon, description }: FeatureCardType, idx: number) => (
						<motion.div
							onHoverStart={() => setHoveredIdx(idx)}
							onHoverEnd={() => setHoveredIdx(null)}
							className="relative group"
						>
							<FeatureCard
								key={title}
								description={description}
								title={title}
								icon={icon}
							/>
							{hoveredIdx === idx && (
								<motion.span
									className="absolute -inset-2 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity bg-primary/10 p-2"
									layoutId="hovered-span"
									transition={{
										duration: 0.2,
										ease: "circInOut",
									}}
								/>
							)}
						</motion.div>
					),
				)}
			</div>
		</main>
	);
}
