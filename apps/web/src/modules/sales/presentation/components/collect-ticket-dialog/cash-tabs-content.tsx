import { useState } from "react";
import { Input } from "@/modules/shared/components/ui/input";
import { Label } from "@/modules/shared/components/ui/label";
import { cn, formatCurrency } from "@/modules/shared/lib/utils";

interface Props {
	total: number;
}

export function CashTabsContent({ total }: Props) {
	const [payWith, setPayWith] = useState(total);

	return (
		<div className="space-y-5">
			<Label className="text-base">
				<span className="w-1/3">Pago con:</span>
				<Input
					value={payWith}
					onChange={(e) => setPayWith(Number.parseFloat(e.target.value))}
					type="number"
					min={0}
					step={0.01}
					className="w-2/3"
				/>
			</Label>
			<p className="w-full flex ">
				<span className="w-1/3">Su cambio:</span>
				<span className={cn("w-2/3", total > payWith && "text-red-500")}>
					{formatCurrency(payWith - total)}
				</span>
			</p>
		</div>
	);
}
