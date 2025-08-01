import { ChevronsUpDown, Check } from "lucide-react";
import { cn } from "../../lib/utils";
import { Button } from "../ui/button";
import {
	FormControl,
	FormDescription,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "../ui/form";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import {
	Command,
	CommandEmpty,
	CommandGroup,
	CommandInput,
	CommandItem,
	CommandList,
} from "../ui/command";
import type { Control, FieldValues, Path } from "react-hook-form";

interface Props<T extends FieldValues> {
	label: string;
	description?: string;
	searchPlaceholder: string;
	emptyMessage?: string;
	name: Path<T>;
	control: Control<T, unknown, T>;
	items: {
		value: string;
		label: string;
	}[];
}

export function ComboBoxInput<T extends FieldValues>({
	control,
	name,
	label,
	description,
	items,
	searchPlaceholder,
	emptyMessage,
}: Props<T>) {
	return (
		<FormField
			control={control}
			name={name}
			render={({ field }) => {
				const selectedItem = items.find(
					(item) => item.value === field.value.toString(),
				);

				return (
					<FormItem className="flex flex-col">
						<FormLabel>{label}</FormLabel>
						<Popover>
							<PopoverTrigger asChild>
								<FormControl>
									<Button
										variant="outline"
										className={cn(
											"w-[200px] justify-between",
											!field.value && "text-muted-foreground",
										)}
									>
										{field.value
											? selectedItem?.label
											: "Seleccione una categoría"}
										<ChevronsUpDown className="opacity-50" />
									</Button>
								</FormControl>
							</PopoverTrigger>
							<PopoverContent className="w-[200px] p-0">
								<Command>
									<CommandInput
										placeholder={searchPlaceholder}
										className="h-9"
									/>
									<CommandList>
										<CommandEmpty>
											{emptyMessage ?? "No se encontraron resultados"}
										</CommandEmpty>
										<CommandGroup>
											{items.map((item) => (
												<CommandItem
													value={item.label}
													key={item.value}
													onSelect={() => {
														field.onChange(item.value);
													}}
												>
													{item.label}
													<Check
														className={cn(
															"ml-auto",
															item.value === field.value
																? "opacity-100"
																: "opacity-0",
														)}
													/>
												</CommandItem>
											))}
										</CommandGroup>
									</CommandList>
								</Command>
							</PopoverContent>
						</Popover>
						{description && <FormDescription>{description}</FormDescription>}
						<FormMessage />
					</FormItem>
				);
			}}
		/>
	);
}
