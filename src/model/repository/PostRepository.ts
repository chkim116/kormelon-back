import { EntityRepository, getCustomRepository, Repository } from 'typeorm';
import readingTime from 'reading-time';

import { Post } from '../entities/Post';

export function postRepository() {
	return getCustomRepository(PostRepository, process.env.NODE_ENV);
}

@EntityRepository(Post)
export class PostRepository extends Repository<Post> {
	async createPost(data: Post) {
		const post = this.create(data);
		const result = await this.save(post);
		return result.id;
	}

	async findById(id: string) {
		const result = await this.findOne({
			where: { id },
			relations: ['category', 'category.parent', 'tags', 'comments'],
		});

		if (!result) {
			return;
		}

		result.view++;
		await this.save(result);

		const category = {
			id: result?.category.id,
			value: result?.category.value,
			parentId: result?.category.parent.id,
			parentValue: result?.category.parent.value,
		};

		return {
			...result,
			category,
			readTime: readingTime(result.content).minutes,
		};
	}

	async findPosts(page: number = 1, per: number = 10) {
		const results = await this.find({
			relations: ['category', 'category.parent', 'tags'],
			order: { id: 'DESC' },
			skip: (page - 1) * per,
			take: per,
		});

		const newResults = results.map((result) => {
			const { id, title, content, tags, createdAt, isPrivate } = result;

			return {
				id,
				title,
				content,
				tags,
				isPrivate,
				createdAt,
				category: {
					id: result.category.id,
					value: result.category.value,
					parentId: result.category.parent.id,
					parentValue: result.category.parent.value,
				},
				readTime: readingTime(result.content).minutes,
			};
		});

		const total = await this.count();

		return {
			total,
			results: newResults,
		};
	}

	async updatePost(id: string, updateData: Post) {
		const post = await this.findOne({ id });

		// update
		const result = await this.save({
			...post,
			...updateData,
		});

		return result.id;
	}

	async deletePost(id: string) {
		await this.delete({ id });
	}
}
