import { EntityRepository, getCustomRepository, Repository } from 'typeorm';

import { Comment } from '../entities/Comment';
import { Post } from '../entities/Post';
import { User } from '../entities/User';

export function commentRepository() {
	return getCustomRepository(CommentRepository, process.env.NODE_ENV);
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

	async createCommentReply(comment: Comment, user: User, text: string) {
		// reply 생성
		const commentReply = await this.create({
			text,
			user,
		});

		// 결합
		const commentReplies = comment.commentReplies
			? [...comment.commentReplies, commentReply]
			: [commentReply];

		const result = this.create({
			...comment,
			commentReplies,
		});

		await this.save(result);
	}
}
