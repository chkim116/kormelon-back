import { EntityRepository, getCustomRepository, Repository } from 'typeorm';
import { Category } from '../entities/Category';

export function categoryRepository() {
	return getCustomRepository(CategoryRepository, process.env.NODE_ENV);
}

@EntityRepository(Category)
export class CategoryRepository extends Repository<Category> {
	async createCategory(value: string) {
		const category = this.create({ value });
		return await this.save(category);
	}
}
