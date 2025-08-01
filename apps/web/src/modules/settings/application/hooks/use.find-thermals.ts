import { useNetInfo } from "@/integrations/net-info";
import { useQuery } from "@tanstack/react-query";

function findThermals(url: string) {
	return fetch(`${url}/printer/impresoras`).then((res) =>
		res.json(),
	) as Promise<string[]>;
}

export function useFindThermals() {
	const { thermalInfo } = useNetInfo();

	return useQuery({
		queryKey: ["findThermals"],
		queryFn: () => findThermals(thermalInfo.url),
	});
}
