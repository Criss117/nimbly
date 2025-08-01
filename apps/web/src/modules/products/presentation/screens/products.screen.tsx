import { Loader2Icon } from "lucide-react";
import { ProductsTable } from "@/modules/products/presentation/components/products-table";
import { SiteHeader } from "@/modules/shared/components/app-sidebar";
import { SearchInput } from "@/modules/shared/components/search-query";
import { Button } from "@/modules/shared/components/ui/button";
import { cn } from "@/modules/shared/lib/utils";
import { CreateProductDialog } from "../components/create-product-dialog";
import { EditProductDialog } from "../components/edit-product-dialog";
import { useFindManyProducts } from "../../application/hooks/use.find-many-products";
import { useFindAllCategories } from "../../application/hooks/use.find-all-categories";

export function ProductsScreen() {
	const {
		data: products,
		isFetching,
		hasNextPage,
		limit,
		searchQuery,
		setSearchQuery,
		fetchNextPage,
		refetch,
		setLimit,
	} = useFindManyProducts();
	const { data: categories } = useFindAllCategories();

	return (
		<>
			<SiteHeader label="Lista de Productos" />
			<ProductsTable.Root
				values={{
					items: products,
					limit,
					isPending: isFetching,
					hasNextPage,
					setLimit,
					fetchNextPage: (callback) => fetchNextPage().then(callback),
				}}
			>
				<div className="m-10 space-y-10">
					<header className="flex justify-between gap-x-5">
						<div className="w-1/2">
							<SearchInput
								placeholder="Buscar productos"
								query={searchQuery}
								setQuery={(value) => setSearchQuery(value)}
							/>
						</div>
						<div className="flex items-end flex-col gap-y-2">
							<CreateProductDialog categories={categories} />
							<div className="flex gap-x-2">
								<ProductsTable.Limit />
								<ProductsTable.Nav />
								<Button variant="outline" size="icon" onClick={() => refetch()}>
									<Loader2Icon
										className={cn("h-4 w-4", isFetching && "animate-spin")}
									/>
								</Button>
							</div>
						</div>
					</header>
					<EditProductDialog.Root categories={categories}>
						<ProductsTable.TableContainer>
							<ProductsTable.Header />
							<ProductsTable.Body />
						</ProductsTable.TableContainer>
						<ProductsTable.Nav />
					</EditProductDialog.Root>
				</div>
			</ProductsTable.Root>
		</>
	);
}
