import { createContext, use, useState } from "react";

interface FilterClientsContextType {
	limit: number;
	setLimit: (limit: number) => void;
	searchQuery: string;
	setSearchQuery: (searchQuery: string) => void;
}

const FilterClientsContext = createContext<FilterClientsContextType | null>(
	null,
);

interface Props {
	children: React.ReactNode;
}

export function FilterClientsProvider({ children }: Props) {
	const [limit, setLimit] = useState(50);
	const [searchQuery, setSearchQuery] = useState("");

	return (
		<FilterClientsContext.Provider
			value={{
				limit,
				searchQuery,
				setLimit,
				setSearchQuery,
			}}
		>
			{children}
		</FilterClientsContext.Provider>
	);
}

export function useFilterClients() {
	const context = use(FilterClientsContext);

	if (context === null) {
		throw new Error(
			"useFilterProducts must be used within a FilterClientsProvider",
		);
	}

	return context;
}
