import { Link } from "react-router-dom";
import { ArrowRight, Bot, Zap, Shield, GitFork } from "lucide-react";

export default function Landing() {
	return (
		<div className="min-h-screen bg-neutral-50 text-neutral-900 selection:bg-neutral-900/10">
			{/* Navbar */}
			<nav className="fixed top-0 w-full z-50 border-b border-neutral-200 bg-white/50 backdrop-blur-xl">
				<div className="container mx-auto px-6 h-16 flex items-center justify-between">
					<div className="flex items-center gap-2 font-bold text-xl">
						<div className="p-2 bg-neutral-900 text-white rounded-lg rotate-90">
							<GitFork className="w-5 h-5" />
						</div>
						<span>TradeFlow</span>
					</div>
					<div className="flex items-center gap-4">
						<Link
							to="/signin"
							className="text-sm font-medium hover:text-neutral-600 transition-colors"
						>
							Sign In
						</Link>
						<Link
							to="/signup"
							className="px-4 py-2 bg-neutral-900 text-white text-sm font-bold rounded-full hover:bg-neutral-800 transition-colors"
						>
							Get Started
						</Link>
					</div>
				</div>
			</nav>

			{/* Hero Section */}
			<main className="relative pt-32 pb-20 px-6">
				<div className="absolute top-20 left-1/2 -translate-x-1/2 w-[500px] h-[500px] bg-neutral-200/50 rounded-full blur-[100px] -z-10" />

				<div className="container mx-auto text-center max-w-4xl">
					<h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-8 bg-gradient-to-br from-neutral-900 via-neutral-700 to-neutral-500 bg-clip-text text-transparent">
						Automate your trading strategies with ease.
					</h1>
					<p className="text-lg md:text-xl text-neutral-500 mb-10 max-w-2xl mx-auto leading-relaxed">
						Build, test, and deploy powerful trading bots using our intuitive
						visual workflow builder. No coding required.
					</p>

					<div className="flex flex-col sm:flex-row items-center justify-center gap-4">
						<Link
							to="/signup"
							className="group relative px-8 py-3 bg-neutral-900 text-white hover:bg-neutral-800 rounded-full font-semibold transition-all hover:scale-105 active:scale-95 flex items-center gap-2 shadow-lg hover:shadow-xl"
						>
							Start Building
							<ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
						</Link>
					</div>
				</div>

				{/* Feature Grid */}
				<div className="container mx-auto mt-32 grid md:grid-cols-3 gap-6">
					<FeatureCard
						icon={<Zap className="w-6 h-6 text-neutral-900" />}
						title="Lightning Fast"
						description="Execute trades in milliseconds with our optimized execution engine."
					/>
					<FeatureCard
						icon={<Bot className="w-6 h-6 text-neutral-900" />}
						title="Visual Builder"
						description="Drag and drop nodes to create complex trading logic without writing code."
					/>
					<FeatureCard
						icon={<Shield className="w-6 h-6 text-neutral-900" />}
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
		<div className="p-6 rounded-2xl bg-white border border-neutral-200 hover:border-neutral-300 transition-colors shadow-sm">
			<div className="w-12 h-12 rounded-xl bg-neutral-100 flex items-center justify-center mb-4">
				{icon}
			</div>
			<h3 className="text-xl font-semibold mb-2 text-neutral-900">{title}</h3>
			<p className="text-neutral-500">{description}</p>
		</div>
	);
}
