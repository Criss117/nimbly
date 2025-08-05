import { Suspense, useState } from "react";
import { Button } from "@/modules/shared/components/ui/button";
import {
	Command,
	CommandEmpty,
	CommandItem,
	CommandList,
} from "@/modules/shared/components/ui/command";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/modules/shared/components/ui/dialog";
import { InfiniteScroll } from "@/modules/shared/components/infinite-scroll";
import { useTRPC } from "@/integrations/trpc/config";
import { useInfiniteQuery } from "@tanstack/react-query";
import type { ProductDetail } from "@nimbly/core/products";
import { useTicketsStore } from "@/modules/sales/application/store/tickets.store";
import { SearchInput } from "@/modules/shared/components/search-query";
import { cn } from "@/modules/shared/lib/utils";

interface Props {
	onSelectProduct: () => void;
	searchQuery: string;
}

function ProductsListSuspence({ searchQuery, onSelectProduct }: Props) {
	const addProduct = useTicketsStore((s) => s.addProduct);
	const trpc = useTRPC();
	const { data, hasNextPage, fetchNextPage, isFetchingNextPage } =
		useInfiniteQuery(
			trpc.products.findMany.infiniteQueryOptions(
				{
					limit: 20,
					searchQuery,
				},
				{
					getNextPageParam: (lastPage) =>
						lastPage.nextCursor
							? {
									lastId: lastPage.nextCursor.lastId,
									createdAt: lastPage.nextCursor.createdAt as unknown as Date,
								}
							: undefined,
				},
			),
		);

	const items = data
		? (data?.pages.flatMap((page) => page.items) as unknown as ProductDetail[])
		: [];

	const handleSelectProduct = (product: ProductDetail) => {
		if (!product.barcode) return;

		addProduct({
			barcode: product.barcode,
			id: product.id,
			description: product.description,
			salePrice: product.salePrice,
			wholesalePrice: product.wholesalePrice,
			stock: product.stock,
			currentPrice: product.salePrice,
			currentStock: 1,
			commonArt: false,
		});
		onSelectProduct();
	};

	return (
		<CommandList>
			<CommandEmpty>No se encontraron productos</CommandEmpty>
			{items.map((i) => (
				<CommandItem
					key={i.id}
					className={cn(
						"flex items-center justify-between",
						i.stock <= 0 && "text-red-500",
					)}
					onSelect={() => handleSelectProduct(i)}
				>
					{i.description}
				</CommandItem>
			))}
			<InfiniteScroll
				hasNextPage={hasNextPage}
				isFetchingNextPage={isFetchingNextPage}
				fetchNextPage={fetchNextPage}
			/>
		</CommandList>
	);
}

export function ProductsList() {
	const [open, setOpen] = useState(false);
	const [searchQuery, setSearchQuery] = useState("");

	const onSelectProduct = () => {
		setOpen(false);
		setSearchQuery("");
	};

	return (
		<Dialog open={open} onOpenChange={setOpen}>
			<DialogTrigger asChild>
				<Button className="w-1/3" variant="outline">
					Buscar
				</Button>
			</DialogTrigger>
			<DialogContent>
				<DialogHeader>
					<DialogTitle>Buscar producto</DialogTitle>
					<DialogDescription />
				</DialogHeader>
				<Command className="space-y-5">
					<SearchInput
						placeholder="Buscar un producto"
						query={searchQuery}
						setQuery={setSearchQuery}
					/>
					<Suspense fallback={<div>Loading...</div>}>
						<ProductsListSuspence
							searchQuery={searchQuery}
							onSelectProduct={onSelectProduct}
						/>
					</Suspense>
				</Command>
			</DialogContent>
		</Dialog>
	);
}
