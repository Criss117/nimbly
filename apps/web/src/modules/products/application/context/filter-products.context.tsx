import { createContext, use, useState } from "react";

interface FilterProductsContextType {
	limit: number;
	setLimit: (limit: number) => void;
	searchQuery: string;
	setSearchQuery: (searchQuery: string) => void;
}

const FilterProductsContext = createContext<FilterProductsContextType | null>(
	null,
);

interface Props {
	children: React.ReactNode;
}

export function FilterProductsProvider({ children }: Props) {
	const [limit, setLimit] = useState(50);
	const [searchQuery, setSearchQuery] = useState("");

	return (
		<FilterProductsContext.Provider
			value={{
				limit,
				searchQuery,
				setLimit,
				setSearchQuery,
			}}
		>
			{children}
		</FilterProductsContext.Provider>
	);
}

export function useFilterProducts() {
	const context = use(FilterProductsContext);

	if (context === null) {
		throw new Error(
			"useFilterProducts must be used within a FilterProductsProvider",
		);
	}

	return context;
}
