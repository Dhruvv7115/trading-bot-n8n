"use client";

import * as React from "react";
import { Bot, GitFork, Settings2, SquareTerminal } from "lucide-react";

import { NavMain } from "@/components/nav-main";
import { NavProjects } from "@/components/nav-projects";
import { NavUser } from "@/components/nav-user";
import { TeamSwitcher } from "@/components/team-switcher";
import {
	Sidebar,
	SidebarContent,
	SidebarFooter,
	SidebarHeader,
	SidebarRail,
} from "@/components/ui/sidebar";

// This is sample data.
const data = {
	user: {
		name: "User",
		email: "user@example.com",
		avatar: "/avatars/shadcn.jpg",
	},
	teams: [
		{
			name: "TradeFlow",
			logo: GitFork,
			plan: "Pro",
		},
	],
	navMain: [
		{
			title: "Dashboard",
			url: "/dashboard",
			icon: SquareTerminal,
			isActive: true,
			items: [
				{
					title: "Overview",
					url: "/dashboard",
				},
				{
					title: "Create Workflow",
					url: "/workflow/create",
				},
			],
		},
		{
			title: "Workflows",
			url: "/dashboard",
			icon: GitFork,
			items: [
				{
					title: "Active",
					url: "/dashboard?filter=active",
				},
				{
					title: "All",
					url: "/dashboard",
				},
			],
		},
		{
			title: "Settings",
			url: "/settings",
			icon: Settings2,
			items: [
				{
					title: "General",
					url: "/settings",
				},
				{
					title: "API Keys",
					url: "/settings/keys",
				},
			],
		},
	],
	projects: [],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
	return (
		<Sidebar
			collapsible="icon"
			{...props}
		>
			<SidebarHeader>
				<TeamSwitcher teams={data.teams} />
			</SidebarHeader>
			<SidebarContent>
				<NavMain items={data.navMain} />
				<NavProjects projects={data.projects} />
			</SidebarContent>
			<SidebarFooter>
				<NavUser user={data.user} />
			</SidebarFooter>
			<SidebarRail />
		</Sidebar>
	);
}
