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
import { postRepository } from './PostRepository';
import { userRepository } from './UserRepository';

export function commentRepository() {
	return getCustomRepository(CommentRepository, process.env.NODE_ENV);
}

function commentReplyRepository() {
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
}
