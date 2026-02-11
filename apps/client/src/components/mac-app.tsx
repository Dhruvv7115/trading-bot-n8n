import React, { useContext } from "react";
import { themeContext } from "./theme-provider";

export default function MacApp() {
  const { theme } = useContext(themeContext);
	return (
		<div className="rounded-lg border border-border/50 max-w-4xl mx-auto overflow-hidden shadow-lg bg-linear-to-br from-white to-neutral-50 dark:from-background/20 dark:to-background/80 mask-[linear-gradient(to_top,transparent_0%,black_36%)]">
			<div className="flex items-center justify-start gap-2 border-b border-border/50 bg-white/80 dark:bg-neutral-900/80 backdrop-blur-sm px-4 py-3">
				<div className="bg-rose-400 rounded-full w-3 h-3 hover:scale-110 transition-transform" />
				<div className="bg-yellow-400 rounded-full w-3 h-3 hover:scale-110 transition-transform" />
				<div className="bg-green-400 rounded-full w-3 h-3 hover:scale-110 transition-transform" />
			</div>
			<div className="p-6 bg-linear-to-b from-neutral-50 to-white dark:from-neutral-800 dark:to-neutral-900">
				<img
					src={`./assets/landing/workflow-${theme}.png`}
					alt="Trading Automation Workflow"
					className="w-full h-auto rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300"
				/>
			</div>
		</div>
	);
}
