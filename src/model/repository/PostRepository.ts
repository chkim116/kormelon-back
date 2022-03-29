import {
	EntityRepository,
	getCustomRepository,
	Like,
	Repository,
} from 'typeorm';
import readingTime from 'reading-time';
import gravatar from 'gravatar';
import dayjs from 'dayjs';

import { Post } from '../entities/Post';
import { parentCategoryRepository } from './CategoryRepository';

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

	async findById(id: number, userId?: string) {
		const result = await this.findOne({
			where: { id },
			relations: ['category', 'category.parent', 'tags', 'comments'],
		});

		if (!result) {
			return;
		}

		if (userId !== result.userId) {
			result.view++;
		}
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
					userImage:
						user?.userImage ||
						gravatar.url(`${withoutUser.username}@email.com`, {
							s: '100',
							d: 'retro',
						}),
					userId: user ? user.id : null,
					commentReplies: comment.commentReplies
						.map((reply) => {
							const { user, password, ...withoutUserReply } = reply;
							return {
								...withoutUserReply,
								userId: reply.user ? reply.user.id : null,
								userImage:
									user?.userImage ||
									gravatar.url(`${withoutUserReply.username}@email.com`, {
										s: '100',
										d: 'retro',
									}),
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

	async findPostRss() {
		const results = await this.find({
			select: ['id', 'content', 'createdAt', 'title'],
			order: {
				id: 'DESC',
			},
		});

		return results;
	}

	async findPosts(page: number = 1, per: number = 10) {
		const results = await this.find({
			relations: ['category', 'category.parent', 'tags'],
			order: { id: 'DESC' },
			skip: (page - 1) * per,
			take: per,
		});

		const newResults = results.map((result) => {
			const {
				id,
				title,
				tags,
				content,
				createdAt,
				isPrivate,
				comments,
				view,
				category,
			} = result;

			return {
				id,
				title,
				tags,
				isPrivate,
				createdAt,
				view,
				commentLength: comments.length,
				category: {
					id: category.id,
					value: category.value,
					parentId: category.parent.id,
					parentValue: category.parent.value,
				},
				readTime: readingTime(content, { wordsPerMinute: 500 }).text,
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

	// 검색 관련
	async findPostsByText(text: string, page: number = 1, per: number = 10) {
		const [results, total] = await this.findAndCount({
			where: { title: Like(`%${text}%`) },
			order: {
				id: 'DESC',
			},
			relations: ['tags', 'category', 'category.parent'],
			skip: (page - 1) * per,
			take: per,
		});

		const newResults = results.map((result) => {
			const {
				id,
				title,
				tags,
				content,
				createdAt,
				isPrivate,
				comments,
				view,
				category,
			} = result;

			return {
				id,
				title,
				tags,
				isPrivate,
				view,
				commentLength: comments.length,
				createdAt,
				category: {
					id: category.id,
					value: category.value,
					parentId: category.parent.id,
					parentValue: category.parent.value,
				},
				readTime: readingTime(content, { wordsPerMinute: 500 }).text,
			};
		});

		return {
			total,
			results: newResults,
		};
	}

	async findPostsByCategory(
		categoryValue: string,
		page: number = 1,
		per: number = 10
	) {
		// TODO: value말고 id로
		const category = await parentCategoryRepository().findOne({
			where: {
				value: categoryValue,
			},
			select: ['id', 'value'],
		});

		const [results, total] = await postRepository().findAndCount({
			where: {
				category: {
					parentId: category?.id,
				},
			},
			relations: ['category', 'category.parent', 'tags', 'comments'],
			order: { id: 'DESC' },
			skip: (page - 1) * per,
			take: per,
		});

		const newResults = results.map((result) => {
			const {
				id,
				title,
				tags,
				content,
				createdAt,
				isPrivate,
				comments,
				view,
				category,
			} = result;

			return {
				id,
				title,
				tags,
				isPrivate,
				createdAt,
				view,
				commentLength: comments.length,
				category: {
					id: category.id,
					value: category.value,
					parentId: category.parent.id,
					parentValue: category.parent.value,
				},
				readTime: readingTime(content, { wordsPerMinute: 500 }).text,
			};
		});

		return {
			total,
			results: newResults,
		};
	}

	async findPostsBySubCategory(
		subCategoryValue: string,
		page: number = 1,
		per: number = 10
	) {
		const [results, total] = await postRepository().findAndCount({
			where: {
				category: {
					value: subCategoryValue,
				},
			},
			relations: ['category', 'category.parent', 'tags', 'comments'],
			order: { id: 'DESC' },
			skip: (page - 1) * per,
			take: per,
		});

		const newResults = results.map((post) => {
			const {
				id,
				title,
				tags,
				createdAt,
				isPrivate,
				content,
				comments,
				view,
				category,
			} = post;

			return {
				id,
				title,
				tags,
				isPrivate,
				createdAt,
				view,
				commentLength: comments.length,
				category: {
					id: category.id,
					value: category.value,
					parentId: category.parent.id,
					parentValue: category.parent.value,
				},
				readTime: readingTime(content, { wordsPerMinute: 500 }).text,
			};
		});

		return {
			total,
			results: newResults,
		};
	}

	async findPostsByTag(tagValue: string, page: number = 1, per: number = 10) {
		const [results, total] = await this.createQueryBuilder('post')
			.innerJoinAndSelect('post.tags', 'tags')
			.innerJoinAndSelect('post.category', 'category')
			.leftJoinAndSelect('post.comments', 'comments')
			.leftJoinAndSelect('category.parent', 'category.parent')
			.where('tags.value = :value', { value: tagValue })
			.orderBy('post.id', 'DESC')
			.skip((page - 1) * per)
			.take(per)
			.getManyAndCount();

		const newResults = results.map((result) => {
			const {
				id,
				title,
				tags,
				content,
				createdAt,
				isPrivate,
				comments,
				view,
				category,
			} = result;

			return {
				id,
				title,
				tags,
				isPrivate,
				createdAt,
				view,
				commentLength: comments.length,
				category: {
					id: category.id,
					value: category.value,
					parentId: category.parent.id,
					parentValue: category.parent.value,
				},
				readTime: readingTime(content, { wordsPerMinute: 500 }).text,
			};
		});

		return {
			total,
			results: newResults,
		};
	}
}
