import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import {
	Breadcrumb,
	BreadcrumbItem,
	BreadcrumbLink,
	BreadcrumbList,
	BreadcrumbPage,
	BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useContext } from "react";
import { themeContext } from "@/components/theme-provider";
import { Moon, Sun } from "lucide-react";
import { motion } from "motion/react";

export default function DashboardLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	const { theme, toggleTheme } = useContext(themeContext);
	const location = useLocation();
	const path = location.pathname
		.split("/")
		.filter((p) => p !== "")
		.map((p) => p.charAt(0).toUpperCase() + p.slice(1));

	path.length !== 1 ? path.unshift("Dashboard") : null;

	const navigate = useNavigate();
	return (
		<SidebarProvider defaultOpen={false}>
			<AppSidebar />
			<main className="w-full">
				<div className="flex items-center justify-between p-4 border-b border-neutral-200">
					<div className="flex items-center gap-4">
						<SidebarTrigger />
						<Breadcrumb>
							<BreadcrumbList>
								{path.map((p, i) =>
									i < path.length - 1 ? (
										<>
											<BreadcrumbItem key={i}>
												<BreadcrumbLink href={`/${p.toLowerCase()}`}>
													{p}
												</BreadcrumbLink>
											</BreadcrumbItem>
											<BreadcrumbSeparator />
										</>
									) : (
										<BreadcrumbItem key={i}>
											<BreadcrumbPage>{p}</BreadcrumbPage>
										</BreadcrumbItem>
									),
								)}
							</BreadcrumbList>
						</Breadcrumb>
					</div>
					<div className="flex items-center gap-4">
						<motion.button
							onClick={() => toggleTheme()}
							className="border-neutral-200 dark:border-neutral-700 hover:bg-neutral-100 transition-colors dark:hover:bg-neutral-800 rounded-lg p-2 border"
						>
							{theme === "light" ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4" />}
						</motion.button>
						<Button
							onClick={() => {
								localStorage.removeItem("token");
								navigate("/signin");
							}}
							variant="outline"
							size="sm"
							className="border-neutral-200 hover:bg-neutral-100"
						>
							Sign Out
						</Button>
						<div className="w-8 h-8 rounded-full bg-neutral-100 border border-neutral-200 flex items-center justify-center text-neutral-600 font-bold text-sm">
							U
						</div>
					</div>
				</div>
				{children}
			</main>
		</SidebarProvider>
	);
}
