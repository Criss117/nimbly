import { useState } from "react";
import { Loader2Icon, Search, X } from "lucide-react";
import { Button } from "@/modules/shared/components/ui/button";
import { Input } from "@/modules/shared/components/ui/input";
import { useSearchProducts } from "@/modules/sales/application/hooks/use.search-products";

export function SearchProducts() {
	const [barcode, setBarcode] = useState("");
	const { isPending, search } = useSearchProducts();

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		if (!barcode) return;

		search(barcode, {});
	};

	return (
		<form
			className="flex gap-x-3 items-center justify-center w-1/2"
			onSubmit={handleSubmit}
		>
			<fieldset className="w-full">
				<div className="relative">
					<Search className="absolute left-2 top-2.5 h-4 text-muted-foreground" />
					<Input
						className="pl-8"
						placeholder="Buscar por codigo de barras "
						value={barcode}
						onChange={(e) => setBarcode(e.target.value)}
					/>
					<Button
						variant="ghost"
						size="icon"
						type="button"
						className="absolute right-2 top-0"
						onClick={() => setBarcode("")}
					>
						<X />
					</Button>
				</div>
			</fieldset>
			<Button type="submit" className="px-6" disabled={isPending}>
				{isPending && <Loader2Icon className="animate-spin" />}
				Agregar producto
			</Button>
		</form>
	);
}
