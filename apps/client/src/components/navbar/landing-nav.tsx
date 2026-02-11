import { GitFork, Link, Moon, Sun } from "lucide-react";
import { motion } from "motion/react";
import React, { useContext } from "react";
import { themeContext } from "../theme-provider";
import { Button } from "../ui/button";

export default function LandingNav() {
	const { theme, toggleTheme } = useContext(themeContext);
	return (
		<nav className="mx-auto max-w-5xl fixed inset-x-0 md:top-4 top-0 z-50">
      {/* web navbar */}
			<div className="hidden md:flex items-center justify-between w-full px-6 py-4 gap-4 border border-border bg-background/20 backdrop-blur-lg rounded-xl">
				<div className="flex items-center gap-2 font-semibold text-xl text-foreground">
					<div className="p-2 bg-primary text-primary-foreground rounded-sm rotate-90 shadow-sm">
						<GitFork className="w-5 h-5" />
					</div>
					<h2>TradeFlow</h2>
				</div>
				<div className="flex items-center gap-6">
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

					<div className="flex items-center gap-2">
						<Button>Sign In</Button>
						<Button variant="outline">Get Started</Button>
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
          <Button>Sign In</Button>
          <Button variant="outline">Get Started</Button>
        </div>
      </div>
		</nav>
	);
}
