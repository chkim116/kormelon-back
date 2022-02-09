import { EntityRepository, getCustomRepository, Repository } from 'typeorm';
import { Post } from '../entities/Post';

export function postRepository() {
	return getCustomRepository(PostRepository, process.env.NODE_ENV);
}

@EntityRepository(Post)
export class PostRepository extends Repository<Post> {
	async createPost(data: Post) {
		const post = this.create(data);
		const result = await this.save(post);
		return result.title;
	}

	async findByTitle(title: string) {
		const result = await this.findOne({
			where: { title },
			relations: ['category', 'user', 'tags', 'comments'],
		});

		if (result) {
			result.view++;
			await this.save(result);
		}

		return result;
	}

	async findPosts(page: number = 1, per: number = 10) {
		const results = await this.find({
			order: { id: 'DESC' },
			skip: (page - 1) * per,
			take: per,
		});

		const total = await this.count();

		return {
			total,
			results,
		};
	}

	async updatePost(title: string, updateData: Post) {
		const post = await this.findOne({ title });

		// update
		const result = await this.save({
			...post,
			...updateData,
		});

		return result.title;
	}

	async deletePost(title: string) {
		await this.delete({ title });
	}
}
