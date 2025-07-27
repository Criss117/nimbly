import type { Control, FieldValues, Path } from "react-hook-form";
import {
	FormControl,
	FormDescription,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "../ui/form";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "../ui/select";

interface Props<T extends FieldValues> extends React.ComponentProps<"select"> {
	label: string;
	description?: string;
	placeholder: string;
	name: Path<T>;
	control: Control<T, unknown, T>;
	items: {
		id: string;
		label: string;
	}[];
	onValueChange?: (value: string) => void;
}

export function SelectFormInput<T extends FieldValues>({
	control,
	name,
	label,
	description,
	items,
	placeholder,
	onValueChange,
}: Props<T>) {
	return (
		<FormField
			control={control}
			name={name}
			render={({ field }) => (
				<FormItem className="w-full">
					<FormLabel>{label}</FormLabel>
					<FormControl>
						<Select
							onValueChange={(value) =>
								onValueChange ? onValueChange(value) : field.onChange(value)
							}
							defaultValue={field.value.toString()}
						>
							<SelectTrigger className="flex-1 w-full">
								<SelectValue placeholder={placeholder} />
							</SelectTrigger>
							<SelectContent>
								{items.map((item) => (
									<SelectItem
										value={item.id}
										key={item.id}
										className="cursor-pointer"
									>
										{item.label}
									</SelectItem>
								))}
							</SelectContent>
						</Select>
					</FormControl>
					{description && <FormDescription>{description}</FormDescription>}
					<FormMessage />
				</FormItem>
			)}
		/>
	);
}
