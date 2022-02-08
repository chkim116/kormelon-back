import { EntityRepository, getCustomRepository, Repository } from 'typeorm';
import { Post } from '../entities/Post';

export function postRepository() {
	return getCustomRepository(PostRepository, process.env.NODE_ENV);
}

@EntityRepository(Post)
export class PostRepository extends Repository<Post> {
	async createPost(data: Post) {
		const post = await this.save(data);
		return post.title;
	}

	async findByTitle(title: string) {
		const result = await this.findOne({
			where: { title },
			relations: ['category', 'user', 'tags'],
		});

		if (result) {
			result.view++;
			await this.save(result);
		}

		return result;
	}

	findPosts(page: number = 1, perPage: number = 10) {
		const results = this.find({
			order: { id: 'DESC' },
			skip: (page - 1) * perPage,
			take: perPage,
		});

		const total = this.count();

		return {
			total,
			results,
		};
	}

	async updatePost(data: Post) {
		await this.update({ title: data.id }, data);
		return data.title;
	}

	deletePost(title: string) {
		return this.delete({ title });
	}
}
