import { useEffect } from "react";
import { Button } from "./ui/button";
import { useIntersectionObserver } from "@uidotdev/usehooks";

interface Props {
	isManual?: boolean;
	hasNextPage?: boolean;
	isFetchingNextPage?: boolean;
	fetchNextPage?: () => void;
}

export function InfiniteScroll({
	isManual = false,
	hasNextPage,
	isFetchingNextPage,
	fetchNextPage,
}: Props) {
	const [ref, entry] = useIntersectionObserver<HTMLDivElement>({
		threshold: 0.5,
		rootMargin: "100px",
	});

	useEffect(() => {
		if (
			entry?.isIntersecting &&
			hasNextPage &&
			!isFetchingNextPage &&
			!isManual
		) {
			fetchNextPage?.();
		}
	}, [
		fetchNextPage,
		isManual,
		entry?.isIntersecting,
		hasNextPage,
		isFetchingNextPage,
	]);

	return (
		<div className="flex flex-col items-center gap-4 p-4">
			<div ref={ref} className="h-1" />
			{hasNextPage ? (
				<Button
					variant="ghost"
					disabled={isFetchingNextPage || isFetchingNextPage}
					onClick={fetchNextPage}
				>
					{isFetchingNextPage ? "Cargando..." : "Cargar más"}
				</Button>
			) : (
				<p className="text-xs text-muted-foreground">
					Estas en el final de la lista
				</p>
			)}
		</div>
	);
}
