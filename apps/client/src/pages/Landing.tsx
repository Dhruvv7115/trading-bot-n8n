import { Link } from "react-router-dom";
import { ArrowRight, Bot, Zap, Shield } from "lucide-react";
import LandingNav from "@/components/navbar/landing-nav";
import Container from "@/components/container";
import FeatureCard from "@/components/feature-card";
import LandingHero from "@/components/landing-hero";

export default function Landing() {
	// const { theme, toggleTheme } = useContext(themeContext);
	return (
		<Container>
			<div className="min-h-screen bg-background text-foreground selection:bg-primary/20">
				{/* Navbar */}
				<LandingNav />

				{/* Hero Section */}
				<LandingHero />
			</div>
		</Container>
	);
}
