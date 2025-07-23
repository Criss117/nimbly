import type { FindManyProductsDto } from "@/products/application/dtos/find-many-products.dto";
import type { ProductDetail, ProductSummary } from "../entities/product.entity";
import type { FindOneProductByDto } from "@/products/application/dtos/find.dto";

export interface ProductsQueriesRepository {
	findAll(): Promise<{ products: ProductSummary[] }>;
	findMany(meta: FindManyProductsDto): Promise<ProductDetail[]>;
	findOneBy(meta: FindOneProductByDto): Promise<ProductDetail>;
	findManyLastProductsUpdated(lastUpdatedAt: Date): Promise<ProductSummary[]>;
}
