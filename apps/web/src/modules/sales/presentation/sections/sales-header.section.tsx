import { Link } from "@tanstack/react-router";
import { LogOut, LayoutDashboardIcon } from "lucide-react";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuGroup,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/modules/shared/components/ui/dropdown-menu";
import { Button } from "@/modules/shared/components/ui/button";
import { Avatar, AvatarFallback } from "@/modules/shared/components/ui/avatar";
import { dashboardLinks } from "@/modules/shared/components/app-sidebar";

export function SalesHeaderSection() {
	return (
		<header className="h-20 flex items-center px-20 justify-between fixed w-full z-30 bg-background">
			<h1 className="text-3xl font-bold">Ventas</h1>
			<div className="flex items-center gap-x-2">
				<Button asChild variant="ghost" size="lg" className="px-0">
					<Link to="/dashboard">
						<LayoutDashboardIcon />
						Ir al dashboard
					</Link>
				</Button>
				<DropdownMenu>
					<DropdownMenuTrigger className="cursor-pointer">
						<Avatar className="h-8 w-8 rounded-full">
							<AvatarFallback className="rounded-lg">CN</AvatarFallback>
						</Avatar>
					</DropdownMenuTrigger>
					<DropdownMenuContent
						className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
						align="end"
						sideOffset={4}
					>
						<DropdownMenuLabel className="p-0 font-normal">
							<div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
								<Avatar className="h-8 w-8 rounded-lg">
									<AvatarFallback className="rounded-lg">CN</AvatarFallback>
								</Avatar>
								<div className="grid flex-1 text-left text-sm leading-tight">
									<span className="truncate font-semibold">Cristian</span>
									<span className="truncate text-xs">Viveros</span>
								</div>
							</div>
						</DropdownMenuLabel>
						<DropdownMenuSeparator />
						<DropdownMenuGroup>
							{dashboardLinks.navMain.map(({ icon: Icon, title, url }) => (
								<DropdownMenuItem key={url} asChild>
									<Link to={url}>
										<Icon />
										{title}
									</Link>
								</DropdownMenuItem>
							))}
						</DropdownMenuGroup>
						<DropdownMenuSeparator />
						<DropdownMenuItem>
							<LogOut />
							Cerrar sesión
						</DropdownMenuItem>
					</DropdownMenuContent>
				</DropdownMenu>
			</div>
		</header>
	);
}
