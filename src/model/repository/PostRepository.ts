import { EntityRepository, getCustomRepository, Repository } from 'typeorm';
import readingTime from 'reading-time';

import { Post } from '../entities/Post';
import dayjs from 'dayjs';

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

	async findById(id: number) {
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

		// 댓글 데이터를 재조합하고, 정렬
		const comments = result.comments
			.map((comment) => {
				const { user, password, ...withoutUser } = comment;
				return {
					...withoutUser,
					userId: comment.user ? comment.user.id : null,
					commentReplies: comment.commentReplies
						.map((reply) => {
							const { user, password, ...withoutUserReply } = reply;
							return {
								...withoutUserReply,
								userId: reply.user ? reply.user.id : null,
							};
						})
						.sort(
							(a, b) =>
								dayjs(a.createdAt).valueOf() - dayjs(b.createdAt).valueOf()
						),
				};
			})
			.sort(
				(a, b) => dayjs(a.createdAt).valueOf() - dayjs(b.createdAt).valueOf()
			);

		return {
			...result,
			comments,
			category,
			readTime: readingTime(result.content, { wordsPerMinute: 500 }).text,
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
				readTime: readingTime(result.content, { wordsPerMinute: 500 }).text,
			};
		});

		const total = await this.count();

		return {
			total,
			results: newResults,
		};
	}

	async updatePost(id: number, updateData: Post) {
		const post = await this.findOne({ id });
		const newPost = this.create({ ...updateData });

		// update
		const result = await this.save({
			...post,
			...newPost,
		});

		return result.id;
	}

	async deletePost(id: number) {
		await this.delete({ id });
	}
}
