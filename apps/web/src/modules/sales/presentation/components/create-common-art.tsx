import { Button } from "@/modules/shared/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogTrigger,
} from "@/modules/shared/components/ui/dialog";

export function CreateCommonArt() {
	return (
		<Dialog>
			<DialogTrigger asChild>
				<Button className="w-1/3" variant="outline">
					Art. Común
				</Button>
			</DialogTrigger>
			<DialogContent>
				<p>Coming soon</p>
			</DialogContent>
		</Dialog>
	);
}
