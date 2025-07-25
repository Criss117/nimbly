import { useEffect, useState } from "react";
import { Search, X } from "lucide-react";
import { useDebounce } from "@uidotdev/usehooks";
import { Input } from "./ui/input";
import { Button } from "./ui/button";

interface Props {
	placeholder: string;
	query: string;
	setQuery: (value: string) => void;
	debounceTime?: number;
}

export function SearchInput({
	setQuery,
	query,
	debounceTime = 500,
	placeholder,
}: Props) {
	const [value, setValue] = useState(query);
	const debouncedValue = useDebounce(value, debounceTime);

	const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setValue(e.target.value.trim().toLowerCase());
	};

	useEffect(() => {
		setQuery(debouncedValue);
	}, [debouncedValue]);

	return (
		<div className="relative flex-1">
			<Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
			<Input
				placeholder={placeholder}
				className="pl-8"
				value={value}
				onChange={handleChange}
			/>
			<Button
				variant="ghost"
				size="icon"
				className="absolute right-2 top-0"
				onClick={() => {
					setValue("");
					setQuery("");
				}}
			>
				<X />
			</Button>
		</div>
	);
}
