import type { Control, FieldValues, Path } from "react-hook-form";
import { Input } from "../ui/input";
import {
	FormControl,
	FormDescription,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "../ui/form";
import { cn } from "@/modules/shared/lib/utils";

interface Props<T extends FieldValues> extends React.ComponentProps<"input"> {
	label?: string;
	description?: string;
	name: Path<T>;
	control: Control<T, unknown, T>;
	required?: boolean;
	hidden?: boolean;
	itemClassName?: string;
	placeholder?: string;
}

export function FormInput<T extends FieldValues>({
	label,
	description,
	control,
	name,
	hidden,
	itemClassName,
	placeholder,
	...props
}: Props<T>) {
	return (
		<FormField
			control={control}
			name={name}
			render={({ field }) => (
				<FormItem className={cn("w-full", hidden && "hidden")}>
					<FormLabel>
						{label}
						{props.required && <span className="text-red-500">*</span>}
					</FormLabel>
					<FormControl>
						<Input
							placeholder={placeholder}
							{...field}
							{...props}
							onChange={(e) => {
								if (props.type !== "number") {
									field.onChange(e);
									return;
								}

								const value = e.target.value;
								const integerValue = Number.parseInt(value);
								if (Number.isNaN(integerValue)) {
									field.onChange(value);
									return;
								}

								field.onChange(integerValue);
							}}
							value={
								props.type !== "number"
									? field.value
									: field.value === 0
										? ""
										: field.value
							}
						/>
					</FormControl>
					{description && <FormDescription>{description}</FormDescription>}
					<FormMessage />
				</FormItem>
			)}
		/>
	);
}
