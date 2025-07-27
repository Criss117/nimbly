import { useState } from "react";
import { HandCoins, User2Icon } from "lucide-react";
import {
	Tabs,
	TabsContent,
	TabsList,
	TabsTrigger,
} from "@/modules/shared/components/ui/tabs";
import type { TicketType } from "@/modules/sales/application/models";
import { CashTabsContent } from "./cash-tabs-content";
import { CreditTabsContent } from "./credit-tabs-content";
import { useSaveTicketForm } from "@/modules/sales/application/store/save-ticket-form.store";

interface Props {
	total: number;
}

export function CollectTicketDialogTabs({ total }: Props) {
	const { form } = useSaveTicketForm();
	const [type, setType] = useState<TicketType>(form.getValues().payType);

	const handleChangeType = (value: TicketType) => {
		form.setValue("payType", value as TicketType);
		form.setValue("clientId", "");
		setType(value);
	};

	return (
		<Tabs
			className="w-full px-5"
			onValueChange={(value) => handleChangeType(value as TicketType)}
			value={type}
		>
			<TabsList className="h-20 space-x-5 px-5 mx-auto">
				<TabsTrigger
					value="cash"
					className="flex flex-col items-center justify-center cursor-pointer w-1/2"
				>
					<HandCoins className="size-8" />
					<span className="text-base">Efectivo</span>
				</TabsTrigger>
				<TabsTrigger
					value="credit"
					className="flex flex-col items-center justify-center cursor-pointer w-1/2"
				>
					<User2Icon className="size-8" />
					<span className="text-base">Crédito</span>
				</TabsTrigger>
			</TabsList>
			<TabsContent value="cash" className="mt-5 w-full">
				<CashTabsContent total={total} />
			</TabsContent>
			<TabsContent value="credit">
				<CreditTabsContent />
			</TabsContent>
		</Tabs>
	);
}
