import type { Control, FieldValues, Path } from "react-hook-form";
import {
	FormControl,
	FormDescription,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "../ui/form";
import { cn } from "@/modules/shared/lib/utils";
import { Textarea } from "../ui/textarea";

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
						<Textarea
							placeholder={placeholder}
							className="resize-none"
							{...field}
						/>
					</FormControl>
					{description && <FormDescription>{description}</FormDescription>}
					<FormMessage />
				</FormItem>
			)}
		/>
	);
}
