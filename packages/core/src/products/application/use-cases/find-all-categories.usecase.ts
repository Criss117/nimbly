import type { CategoriesQueriesRepository } from "@/products/domain/repositories/categories-queries.repository";

export class FindAllCategoriesUseCase {
	constructor(
		private readonly categoriesQueriesRepository: CategoriesQueriesRepository,
	) {}

	public execute() {
		return this.categoriesQueriesRepository.findAll();
	}
}
