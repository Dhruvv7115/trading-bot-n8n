import { GitFork, Moon, Sun } from "lucide-react";
import { easeInOut, motion } from "motion/react";
import { useContext } from "react";
import { themeContext } from "../theme-provider";
import { Button } from "../ui/button";
import { useNavigate } from "react-router-dom";

const MotionMoon = motion(Moon);
const MotionSun = motion(Sun);

export default function LandingNav() {
	const { theme, toggleTheme } = useContext(themeContext);
	const navigate = useNavigate();
	return (
		<nav className="mx-auto max-w-5xl fixed inset-x-0 md:top-4 top-0 z-50">
			{/* web navbar */}
			<div className="hidden md:flex items-center justify-between w-full px-6 py-4 gap-4 dark:shadow-[0px_2px_3px_-1px_#ffffff1a,0px_1px_0px_0px_#ffffff05,0px_0px_0px_1px_#ffffff14] shadow-[0px_2px_3px_-1px_#0000001a,0px_1px_0px_0px_#191c2105,0px_0px_0px_1px_#191c2114] bg-background/20 backdrop-blur-md rounded-lg">
				<div className="flex items-center gap-2 font-semibold text-xl text-foreground">
					<div className="p-2 bg-primary text-primary-foreground rounded-sm rotate-90 shadow-sm">
						<GitFork className="w-5 h-5" />
					</div>
					<h2>TradeFlow</h2>
				</div>
				<div className="flex items-center gap-6">
					<motion.button
						onClick={() => toggleTheme()}
						className="bg-background hover:bg-accent hover:text-accent-foreground text-foreground dark:bg-input/30 dark:hover:bg-input/50 transition-colors rounded-[12px] border flex items-center p-2"
						initial="rest"
						whileTap="pressed"
					>
						{theme === "light" ? (
							<MotionMoon
								className="w-4 h-4"
								variants={{
									rest: { opacity: 1, rotate: 0 },
									pressed: { opacity: 0, rotate: 90 },
								}}
								transition={{ type: "spring", stiffness: 300, damping: 20, ease: easeInOut }}
							/>
						) : (
							<MotionSun
								className="w-4 h-4"
								variants={{
									rest: { opacity: 1, rotate: 0 },
									pressed: { opacity: 0, rotate: 90 },
								}}
								transition={{ type: "spring", stiffness: 300, damping: 20, ease: easeInOut }}
							/>
						)}
					</motion.button>

					<div className="flex items-center gap-2">
						<Button
							onClick={() => navigate("/signin")}
							className="rounded-[12px]"
						>
							Sign In
						</Button>
						<Button
							onClick={() => navigate("/signup")}
							className="rounded-[12px]"
							variant="outline"
						>
							Get Started
						</Button>
					</div>
				</div>
			</div>
			{/* mobile navbar */}
			<div className="flex items-center justify-between w-full px-6 py-4 gap-4 md:hidden border-y border-border bg-background/80 backdrop-blur-xl">
				<div className="flex items-center gap-2 font-semibold text-xl text-foreground">
					<div className="p-2 bg-primary text-primary-foreground rounded-sm rotate-90 shadow-sm">
						<GitFork className="w-5 h-5" />
					</div>
					<h2>TradeFlow</h2>
				</div>
				<div className="flex items-center gap-2">
					<Button onClick={() => navigate("/signin")}>Sign In</Button>
					<Button
						onClick={() => navigate("/signup")}
						variant="outline"
					>
						Get Started
					</Button>
				</div>
			</div>
		</nav>
	);
}
