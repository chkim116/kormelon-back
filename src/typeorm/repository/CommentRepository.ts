import {
	EntityRepository,
	getCustomRepository,
	getRepository,
	Repository,
} from 'typeorm';

import { Comment } from '../entities/Comment';
import { CommentReply } from '../entities/CommentReply';
import { Post } from '../entities/Post';
import { User } from '../entities/User';

export function commentRepository() {
	return getCustomRepository(CommentRepository, process.env.NODE_ENV);
}

export function commentReplyRepository() {
	return getRepository(CommentReply, process.env.NODE_ENV);
}

@EntityRepository(Comment)
export class CommentRepository extends Repository<Comment> {
	async createComment(post: Post, user: User, text: string) {
		const comment = this.create({
			text,
			user,
			commentReplies: [],
			post,
		});
		await this.save(comment);
	}

	async updateComment(id: string, text: string) {
		const comment = await commentRepository().findOne({ id });

		const updateComment = commentRepository().create({ text });

		// update
		await commentRepository().save({
			...comment,
			...updateComment,
		});
	}

	async createCommentReply(parent: Comment, user: User, text: string) {
		// reply 생성
		const commentReply = commentReplyRepository().create({
			text,
			user,
			parent,
		});

		// 결합
		const commentReplies = parent.commentReplies
			? [...parent.commentReplies, commentReply]
			: [commentReply];

		const result = this.create({
			...parent,
			commentReplies,
		});

		await this.save(result);
		await commentReplyRepository().save(commentReply);
	}

	async updateCommentReply(id: string, text: string) {
		const commentReply = await commentReplyRepository().findOne({ id });

		const updateCommentReply = commentReplyRepository().create({ text });

		// update
		await commentReplyRepository().save({
			...commentReply,
			...updateCommentReply,
		});
	}

	async deleteCommentReply(id: string) {
		await commentReplyRepository().delete({ id });
	}
}
