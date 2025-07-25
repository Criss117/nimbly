import { createFileRoute, Link } from "@tanstack/react-router";

export const Route = createFileRoute("/error")({
	component: RouteComponent,
});

function RouteComponent() {
	return (
		<div className="w-full h-screen flex items-center justify-center">
			<div className="flex flex-col items-center justify-center space-y-5">
				<h1 className="text-primary text-5xl font-bold">Nimbly</h1>
				<p>Algo ha fallado</p>
				<Link to="/dashboard">Volver al dashboard</Link>
			</div>
		</div>
	);
}
