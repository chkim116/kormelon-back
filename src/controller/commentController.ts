import { Request, Response } from 'express';

import logger from '../lib/logger';
import {
	commentReplyRepository,
	commentRepository,
} from '../model/repository/CommentRepository';
import { postRepository } from '../model/repository/PostRepository';

import { CreateCommentDTO } from './dto/commentController.dto';

export const postCreateComment = async (req: Request, res: Response) => {
	const { id } = req.params;
	const { text, password, username }: CreateCommentDTO = req.body;
	const user = req.user;

	try {
		const post = await postRepository().findOne({ id: +id });

		if (!post) {
			throw new Error('post가 없습니다.');
		}

		const creator = {
			username: user?.username || username || '익명',
			password: user?.password || password || '',
		};

		const comment = await commentRepository().createComment({
			post,
			user,
			text,
			creator,
			isAnonymous: !user,
		});

		res.status(201).send({
			id: comment.id,
			text: comment.text,
			isAnonymous: comment.isAnonymous,
			userId: comment.user ? comment.user.id : null,
			username: comment.username,
			commentReplies: comment.commentReplies,
			createdAt: comment.createdAt,
			deletedAt: comment.deletedAt,
		});
	} catch (err) {
		logger.error(err);
		res.status(400).send({ message: '댓글 작성 중 오류가 발생했습니다.' });
	}
};

export const postCreateReply = async (req: Request, res: Response) => {
	const { id } = req.params;
	const { text, username, password }: CreateCommentDTO = req.body;
	const user = req.user;

	try {
		const comment = await commentRepository().findOne({
			where: { id },
			relations: ['commentReplies'],
		});

		if (!comment) {
			throw new Error('comment가 없습니다.');
		}

		const creator = {
			username: user?.username || username || '익명',
			password: user?.password || password || '',
		};

		const reply = await commentRepository().createCommentReply({
			comment,
			user,
			text,
			creator,
			isAnonymous: !user,
		});

		res.status(201).send({
			id: reply.id,
			text: reply.text,
			isAnonymous: reply.isAnonymous,
			userId: reply.user ? reply.user.id : null,
			username: reply.username,
			createdAt: reply.createdAt,
		});
	} catch (err) {
		logger.error(err);
		res.status(400).send({ message: '대댓글 작성 중 오류가 발생했습니다.' });
	}
};

export const patchCreateComment = async (req: Request, res: Response) => {
	const { id } = req.params;
	const { text, password }: CreateCommentDTO = req.body;
	const user = req.user;

	try {
		const comment = await commentRepository().findOne({
			where: { id },
		});

		if (!comment) {
			return res.status(400).send({ message: '댓글이 존재하지 않습니다.' });
		}

		if (comment.isAnonymous && comment.password !== password) {
			return res.status(401).send({ message: '비밀번호가 틀립니다.' });
		}

		if (
			!comment.isAnonymous &&
			user &&
			comment.user &&
			comment.user.id !== user.id
		) {
			return res
				.status(401)
				.send({ message: '댓글을 작성한 유저가 아닙니다.' });
		}

		await commentRepository().updateComment(comment.id, text);

		res.sendStatus(200);
	} catch (err) {
		logger.error(err);
		res.status(400).send({ message: '변경 중 오류가 발생했습니다.' });
	}
};

export const patchCreateReply = async (req: Request, res: Response) => {
	const { id } = req.params;
	const { text, password }: CreateCommentDTO = req.body;
	const user = req.user;

	try {
		const commentReply = await commentReplyRepository().findOne({
			where: { id },
		});

		if (!commentReply) {
			return res.status(400).send({ message: '댓글이 존재하지 않습니다.' });
		}

		if (commentReply.isAnonymous && commentReply.password !== password) {
			return res.status(401).send({ message: '비밀번호가 틀립니다.' });
		}

		if (
			!commentReply.isAnonymous &&
			user &&
			commentReply.user &&
			commentReply.user.id !== user.id
		) {
			return res
				.status(401)
				.send({ message: '댓글을 작성한 유저가 아닙니다.' });
		}

		await commentRepository().updateCommentReply(commentReply.id, text);

		res.sendStatus(200);
	} catch (err) {
		logger.error(err);
		res.status(400).send({ message: '변경 중 오류가 발생했습니다.' });
	}
};

export const deleteComment = async (req: Request, res: Response) => {
	const { id } = req.params;
	const { password } = req.body;
	const user = req.user;

	try {
		const comment = await commentRepository().findOne({
			where: { id },
		});

		// TODO: 관리자면 삭제 가능하게

		if (!comment) {
			throw new Error();
		}

		if (comment.isAnonymous && comment.password !== password) {
			return res.status(401).send({ message: '비밀번호가 틀립니다.' });
		}

		if (
			!comment.isAnonymous &&
			user &&
			comment.user &&
			comment.user.id !== user.id
		) {
			return res
				.status(401)
				.send({ message: '댓글을 작성한 유저가 아닙니다.' });
		}

		await commentRepository().deleteComment(comment);
		res.sendStatus(200);
	} catch (err) {
		logger.error(err);
		res.status(400).send({ message: '삭제 중 오류가 발생했습니다.' });
	}
};

export const deleteReply = async (req: Request, res: Response) => {
	const { id } = req.params;
	const { password } = req.body;
	const user = req.user;

	try {
		const commentReply = await commentReplyRepository().findOne({
			where: { id },
			relations: ['parent', 'user'],
		});

		// TODO: 관리자면 삭제 가능하게

		if (!commentReply) {
			throw new Error();
		}

		if (commentReply.isAnonymous && commentReply.password !== password) {
			return res.status(401).send({ message: '비밀번호가 틀립니다.' });
		}

		if (
			!commentReply.isAnonymous &&
			user &&
			commentReply.user &&
			commentReply.user.id !== user.id
		) {
			return res
				.status(401)
				.send({ message: '댓글을 작성한 유저가 아닙니다.' });
		}

		await commentRepository().deleteCommentReply(commentReply);
		res.sendStatus(200);
	} catch (err) {
		logger.error(err);
		res.status(400).send({ message: '삭제 중 오류가 발생했습니다.' });
	}
};
