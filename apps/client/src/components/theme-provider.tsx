import React, { createContext, useEffect, useState } from "react";

type ThemeType = "light" | "dark" | "system";
export const themeContext = createContext({
	theme: "",
	toggleTheme: () => {},
});
export default function ThemeProvider({
	children,
	defaultTheme,
}: {
	children: React.ReactNode;
	defaultTheme?: "light" | "dark" | "system";
}) {
	const [theme, setTheme] = useState<ThemeType>(
		defaultTheme === "system"
			? window.matchMedia("(prefers-color-scheme: dark)").matches
				? "dark"
				: "light"
			: defaultTheme || "dark",
	);

	useEffect(() => {
		const saved = localStorage.getItem("theme") as ThemeType;
		const prefersDark = window.matchMedia(
			"(prefers-color-scheme: dark)",
		).matches;
		const finalTheme: ThemeType = saved || (prefersDark ? "dark" : "light");

		setTheme(finalTheme);
		document.querySelector("html")?.classList.add(finalTheme);
	}, []);

	const toggleTheme = () => {
		const next = theme === "light" ? "dark" : "light";
		setTheme(next);
		document.querySelector("html")?.classList.remove(theme);
		document.querySelector("html")?.classList.add(next);
		localStorage.setItem("theme", next);
	};

	return (
		<themeContext.Provider value={{ theme, toggleTheme }}>
			{children}
		</themeContext.Provider>
	);
}
