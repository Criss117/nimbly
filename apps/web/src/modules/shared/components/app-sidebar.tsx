import { Link, useLocation } from "@tanstack/react-router";
import {
	Sidebar,
	SidebarContent,
	SidebarGroup,
	SidebarGroupContent,
	SidebarHeader,
	SidebarMenu,
	SidebarMenuButton,
	SidebarMenuItem,
	SidebarTrigger,
} from "./ui/sidebar";
import {
	ArrowUpCircleIcon,
	LayoutDashboardIcon,
	ListIcon,
	PlusCircleIcon,
	Settings,
	Users2Icon,
} from "lucide-react";
import ModeToggle from "./mode-toggle";
import { Separator } from "./ui/separator";

interface SiteHeaderProps {
	label: string;
}

export const dashboardLinks = {
	navMain: [
		{
			title: "Inicio",
			url: "/dashboard",
			icon: LayoutDashboardIcon,
		},
		{
			title: "Productos",
			url: "/dashboard/products",
			icon: ListIcon,
		},
		{
			title: "Clientes",
			url: "/dashboard/clients",
			icon: Users2Icon,
		},
		{
			title: "Configuraciones",
			url: "/dashboard/settings",
			icon: Settings,
		},
	],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
	const { pathname } = useLocation();

	return (
		<Sidebar collapsible="icon" {...props}>
			<SidebarHeader>
				<SidebarMenu>
					<SidebarMenuItem>
						<SidebarMenuButton
							asChild
							className="data-[slot=sidebar-menu-button]:!p-1.5"
						>
							<Link to="/dashboard">
								<ArrowUpCircleIcon className="h-5 w-5" />
								<span className="text-base font-semibold">Nimbly</span>
							</Link>
						</SidebarMenuButton>
					</SidebarMenuItem>
				</SidebarMenu>
			</SidebarHeader>
			<SidebarContent>
				<SidebarGroup>
					<SidebarGroupContent className="flex flex-col gap-2">
						<SidebarMenu>
							<SidebarMenuItem className="flex items-center gap-2">
								<SidebarMenuButton
									tooltip="Quick Create"
									className="min-w-8 bg-primary text-primary-foreground duration-200 ease-linear hover:bg-primary/90 hover:text-primary-foreground active:bg-primary/90 active:text-primary-foreground"
									asChild
								>
									<Link to="/sales">
										<PlusCircleIcon />
										<span>Ir a Ventas</span>
									</Link>
								</SidebarMenuButton>
							</SidebarMenuItem>
						</SidebarMenu>
						<SidebarMenu>
							{dashboardLinks.navMain.map((item) => (
								<SidebarMenuItem key={item.title}>
									<Link to={item.url}>
										<SidebarMenuButton
											tooltip={item.title}
											isActive={pathname === item.url}
										>
											{item.icon && <item.icon />}
											<span>{item.title}</span>
										</SidebarMenuButton>
									</Link>
								</SidebarMenuItem>
							))}
						</SidebarMenu>
					</SidebarGroupContent>
				</SidebarGroup>
			</SidebarContent>
		</Sidebar>
	);
}

export function SiteHeader({ label }: SiteHeaderProps) {
	return (
		<header className="group-has-data-[collapsible=icon]/sidebar-wrapper:h-12 flex h-12 shrink-0 items-center gap-2 border-b transition-[width,height] ease-linear">
			<div className="flex w-full items-center gap-1 px-4 lg:gap-2 lg:px-6">
				<SidebarTrigger className="-ml-1" />
				<Separator
					orientation="vertical"
					className="mx-2 data-[orientation=vertical]:h-4"
				/>
				<h1 className="text-base font-medium">{label}</h1>
			</div>
			<div className="flex items-center gap-1 px-4 lg:gap-2 lg:px-6">
				<ModeToggle />
			</div>
		</header>
	);
}
