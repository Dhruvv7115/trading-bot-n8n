import { Link } from "react-router-dom";
import { ArrowRight, Bot, Zap, Shield } from "lucide-react";

export default function Landing() {
	return (
		<div className="min-h-screen bg-neutral-950 text-white selection:bg-indigo-500/30">
			{/* Navbar */}
			<nav className="fixed top-0 w-full z-50 border-b border-white/10 bg-neutral-950/50 backdrop-blur-xl">
				<div className="container mx-auto px-6 h-16 flex items-center justify-between">
					<div className="flex items-center gap-2 font-bold text-xl">
						<div className="p-2 bg-indigo-600 rounded-lg">
							<Bot className="w-5 h-5" />
						</div>
						<span>TradeFlow</span>
					</div>
					<div className="flex items-center gap-4">
						<Link
							to="/signin"
							className="text-sm font-medium hover:text-indigo-400 transition-colors"
						>
							Sign In
						</Link>
						<Link
							to="/signup"
							className="px-4 py-2 bg-white text-neutral-950 text-sm font-bold rounded-full hover:bg-neutral-200 transition-colors"
						>
							Get Started
						</Link>
					</div>
				</div>
			</nav>

			{/* Hero Section */}
			<main className="relative pt-32 pb-20 px-6">
				<div className="absolute top-20 left-1/2 -translate-x-1/2 w-[500px] h-[500px] bg-indigo-600/20 rounded-full blur-[100px] -z-10" />

				<div className="container mx-auto text-center max-w-4xl">
					<h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-8 bg-gradient-to-br from-white via-white/90 to-white/50 bg-clip-text text-transparent">
						Automate your trading strategies with ease.
					</h1>
					<p className="text-lg md:text-xl text-neutral-400 mb-10 max-w-2xl mx-auto leading-relaxed">
						Build, test, and deploy powerful trading bots using our intuitive
						visual workflow builder. No coding required.
					</p>

					<div className="flex flex-col sm:flex-row items-center justify-center gap-4">
						<Link
							to="/signup"
							className="group relative px-8 py-3 bg-indigo-600 hover:bg-indigo-500 rounded-full font-semibold transition-all hover:scale-105 active:scale-95 flex items-center gap-2"
						>
							Start Building
							<ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
						</Link>
					</div>
				</div>

				{/* Feature Grid */}
				<div className="container mx-auto mt-32 grid md:grid-cols-3 gap-6">
					<FeatureCard
						icon={<Zap className="w-6 h-6 text-yellow-400" />}
						title="Lightning Fast"
						description="Execute trades in milliseconds with our optimized execution engine."
					/>
					<FeatureCard
						icon={<Bot className="w-6 h-6 text-indigo-400" />}
						title="Visual Builder"
						description="Drag and drop nodes to create complex trading logic without writing code."
					/>
					<FeatureCard
						icon={<Shield className="w-6 h-6 text-emerald-400" />}
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
		<div className="p-6 rounded-2xl bg-neutral-900/50 border border-white/5 hover:border-white/10 transition-colors">
			<div className="w-12 h-12 rounded-xl bg-neutral-800 flex items-center justify-center mb-4">
				{icon}
			</div>
			<h3 className="text-xl font-semibold mb-2">{title}</h3>
			<p className="text-neutral-400">{description}</p>
		</div>
	);
}
