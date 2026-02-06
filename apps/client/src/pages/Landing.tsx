import { Link } from "react-router-dom";
import { ArrowRight, Bot, Zap, Shield, GitFork, Moon, Sun } from "lucide-react";
import { useContext } from "react";
import { themeContext } from "../components/theme-provider";
import { motion } from "motion/react";

export default function Landing() {
	const { theme, toggleTheme } = useContext(themeContext);
	return (
		<div className="min-h-screen bg-background text-foreground selection:bg-primary/20">
			{/* Navbar */}
			<nav className="fixed top-0 w-full z-50 border-b border-border bg-background/80 backdrop-blur-xl">
				<div className="container mx-auto px-6 h-16 flex items-center justify-between">
					<div className="flex items-center gap-2 font-bold text-xl text-foreground">
						<div className="p-2 bg-primary text-primary-foreground rounded-lg rotate-90 shadow-sm">
							<GitFork className="w-5 h-5" />
						</div>
						<span>TradeFlow</span>
					</div>
					<div className="flex items-center gap-4">
						<motion.button
							whileTap={{ scale: 0.95 }}
							onClick={() => toggleTheme()}
							className="border-border hover:bg-accent hover:text-accent-foreground text-muted-foreground transition-colors rounded-lg p-2 border"
						>
							{theme === "light" ? (
								<Moon className="w-4 h-4" />
							) : (
								<Sun className="w-4 h-4" />
							)}
						</motion.button>
						<Link
							to="/signin"
							className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
						>
							Sign In
						</Link>
						<Link
							to="/signup"
							className="px-4 py-2 bg-primary text-primary-foreground text-sm font-bold rounded-full hover:bg-primary/90 transition-colors shadow-sm hover:shadow-primary/25"
						>
							Get Started
						</Link>
					</div>
				</div>
			</nav>

			{/* Hero Section */}
			<main className="relative pt-32 pb-20 px-6 overflow-hidden">
				<div className="absolute top-20 left-1/2 -translate-x-1/2 w-[500px] h-[500px] bg-primary/20 rounded-full blur-[100px] -z-10" />

				<div className="container mx-auto text-center max-w-4xl">
					<h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-8 bg-linear-to-br from-foreground via-foreground/90 to-muted-foreground bg-clip-text text-transparent">
						Automate your trading strategies with ease.
					</h1>
					<p className="text-sm md:text-lg text-muted-foreground mb-10 md:max-w-lg max-w-sm mx-auto leading-relaxed">
						Build, test, and deploy powerful trading bots using our intuitive
						visual workflow builder. No coding required.
					</p>

					<div className="flex flex-col sm:flex-row items-center justify-center gap-4">
						<Link
							to="/signup"
							className="group relative px-8 py-3 bg-primary text-primary-foreground hover:bg-primary/90 rounded-full font-semibold transition-all hover:scale-105 active:scale-95 flex items-center gap-2 shadow-lg shadow-primary/25"
						>
							Start Building
							<ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
						</Link>
					</div>
				</div>

				{/* Feature Grid */}
				<div className="container mx-auto mt-32 grid md:grid-cols-3 gap-6">
					<FeatureCard
						icon={<Zap className="w-6 h-6 text-primary" />}
						title="Lightning Fast"
						description="Execute trades in milliseconds with our optimized execution engine."
					/>
					<FeatureCard
						icon={<Bot className="w-6 h-6 text-primary" />}
						title="Visual Builder"
						description="Drag and drop nodes to create complex trading logic without writing code."
					/>
					<FeatureCard
						icon={<Shield className="w-6 h-6 text-primary" />}
						title="Secure & Reliable"
						description="Enterprise-grade security for your API keys and execution environments."
					/>
				</div>
			</main>
		</div>
	);
}

function FeatureCard({
	icon,
	title,
	description,
}: {
	icon: React.ReactNode;
	title: string;
	description: string;
}) {
	return (
		<div className="p-6 rounded-2xl bg-card text-card-foreground border border-border hover:border-ring/50 transition-colors shadow-sm">
			<div className="w-12 h-12 rounded-xl bg-secondary flex items-center justify-center mb-4 text-primary">
				{icon}
			</div>
			<h3 className="text-xl font-semibold mb-2">{title}</h3>
			<p className="text-muted-foreground">{description}</p>
		</div>
	);
}
