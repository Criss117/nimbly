import { Loader2Icon } from "lucide-react";

export function PageLoader() {
	return (
		<div className="w-full h-screen flex items-center justify-center">
			<div className="flex flex-col items-center justify-center space-y-5">
				<h1 className="text-primary text-5xl font-bold">Nimbly</h1>
				<Loader2Icon className="animate-spin" />
			</div>
		</div>
	);
}
