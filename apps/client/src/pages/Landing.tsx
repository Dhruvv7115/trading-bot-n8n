import LandingNav from "@/components/navbar/landing-nav";
import Container from "@/components/container";
import LandingHero from "@/components/landing-hero";

export default function Landing() {
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
