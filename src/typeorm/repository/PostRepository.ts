import { EntityRepository, Repository } from 'typeorm';
import { CreatePostDTO } from '../../controller/dto/postController.dto';
import { Post } from '../entities/Post';

@EntityRepository(Post)
export class PostRepository extends Repository<Post> {
	async createPost(data: CreatePostDTO) {
		const post = await this.create(data);
		await this.save(post);
		return post.title;
	}

	findByTitle(title: string) {
		return this.findOne({ title });
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
