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

interface CreateComment {
	post: Post;
	user?: User;
	text: string;
	isAnonymous: boolean;
	creator: { username: string; password: string };
}

interface CreateCommentReply {
	comment: Comment;
	user?: User;
	text: string;
	isAnonymous: boolean;
	creator: { username: string; password: string };
}

@EntityRepository(Comment)
export class CommentRepository extends Repository<Comment> {
	async createComment(data: CreateComment) {
		const { post, user = null, text, creator, isAnonymous } = data;

		const comment = this.create({
			text,
			user,
			...creator,
			isAnonymous,
			commentReplies: [],
			post,
		});

		return await this.save(comment);
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

	async deleteComment(prevComment: Comment) {
		if (prevComment.commentReplies.length) {
			const deleteComment = this.create({
				text: '삭제된 댓글입니다.',
				deletedAt: new Date(),
			});

			return await this.save({ ...prevComment, ...deleteComment });
		}

		await this.delete(prevComment.id);
	}

	async createCommentReply(data: CreateCommentReply) {
		const { comment: parent, creator, text, user = null, isAnonymous } = data;
		// reply 생성
		const newCommentReply = commentReplyRepository().create({
			text,
			user,
			parent,
			isAnonymous,
			...creator,
		});

		const commentReply = await commentReplyRepository().save(newCommentReply);

		// 결합
		const commentReplies = parent.commentReplies
			? [...parent.commentReplies, commentReply]
			: [commentReply];

		const result = this.create({
			...parent,
			commentReplies,
		});

		await this.save(result);

		return commentReply;
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

	async deleteCommentReply(comment: CommentReply) {
		await commentReplyRepository().delete({ id: comment.id });
	}
}
