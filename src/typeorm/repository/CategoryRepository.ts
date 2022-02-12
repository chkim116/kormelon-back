import { EntityRepository, getCustomRepository, Repository } from 'typeorm';
import { Category } from '../entities/Category';
import { ParentCategory } from '../entities/ParentCategory';

export function categoryRepository() {
	return getCustomRepository(CategoryRepository, process.env.NODE_ENV);
}

export function parentCategoryRepository() {
	return getCustomRepository(ParentCategoryRepository, process.env.NODE_ENV);
}

// 상위 카테고리
@EntityRepository(ParentCategory)
export class ParentCategoryRepository extends Repository<ParentCategory> {
	async createParentCategory(value: string) {
		const parentCategory = this.create({ value });
		await this.save(parentCategory);

		// 하위 카테고리를 기본적으로 생성합니다.
		const category = categoryRepository().create({
			value: 'default',
			parent: parentCategory,
			posts: [],
		});
		await categoryRepository().save(category);
	}

	async updateParentCategory(parentCategory: ParentCategory, value: string) {
		const update = this.create({ value });
		await this.save({ ...parentCategory, ...update });
	}

	async deleteParentCategory(id: string) {
		await this.query(`SET foreign_key_checks = 0;`);

		const sub = await this.findOne({
			where: { id },
			relations: ['categories'],
		});

		// onDelete가 먹히지 않아 대신함.
		const deleteAll =
			sub?.categories.map(
				async (category) =>
					await categoryRepository().delete({ id: category!.id })
			) || [];

		await Promise.all(deleteAll);

		await this.delete({ id });
	}
}

// 하위 카테고리
@EntityRepository(Category)
export class CategoryRepository extends Repository<Category> {
	async createCategory(value: string) {
		const category = this.create({ value });
		return await this.save(category);
	}

	async addCategory(parent: ParentCategory, value: string) {
		// parent 필수.
		const category = this.create({ value, parent });
		return await this.save(category);
	}

	async updateCategory(category: Category, value: string) {
		const update = await this.create({ value });

		return await this.save({ ...category, ...update });
	}

	async deleteCategory(id: string) {
		await this.query(`SET foreign_key_checks = 0;`);
		return await this.delete({ id });
	}
}
