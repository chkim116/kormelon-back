import { Request, Response } from 'express';
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
		const post = await postRepository().findOne({ id });

		if (!post) {
			throw new Error('post가 없습니다.');
		}

		const creator = {
			username: user?.username || username || '익명',
			password: user?.password || password || '',
		};

		await commentRepository().createComment({
			post,
			user,
			text,
			creator,
		});
		res.sendStatus(201);
	} catch (err) {
		console.log(err);
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

		await commentRepository().createCommentReply({
			comment,
			user,
			text,
			creator,
		});

		res.sendStatus(201);
	} catch (err) {
		console.log(err);
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
			relations: ['user'],
		});

		if (!comment) {
			return res.status(400).send({ message: '댓글이 존재하지 않습니다.' });
		}

		if (!user) {
			if (comment.password !== password) {
				return res.status(401).send({ message: '비밀번호가 틀립니다.' });
			}
		}

		if (user && comment.user.id !== user.id) {
			return res
				.status(401)
				.send({ message: '댓글을 작성한 유저가 아닙니다.' });
		}

		await commentRepository().updateComment(comment.id, text);

		res.sendStatus(200);
	} catch (err) {
		console.log(err);
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
			relations: ['user'],
		});

		if (!commentReply) {
			return res.status(400).send({ message: '댓글이 존재하지 않습니다.' });
		}

		if (!user) {
			if (commentReply.password !== password) {
				return res.status(401).send({ message: '비밀번호가 틀립니다.' });
			}
		}

		if (user && commentReply.user.id !== user.id) {
			return res
				.status(401)
				.send({ message: '댓글을 작성한 유저가 아닙니다.' });
		}

		await commentRepository().updateCommentReply(commentReply.id, text);

		res.sendStatus(200);
	} catch (err) {
		console.log(err);
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
			relations: ['user'],
		});

		if (!comment) {
			throw new Error();
		}

		if (!user) {
			if (comment.password !== password) {
				return res.status(401).send({ message: '비밀번호가 틀립니다.' });
			}
		}

		if (user && comment.user.id !== user.id) {
			return res
				.status(401)
				.send({ message: '댓글을 작성한 유저가 아닙니다.' });
		}

		await commentRepository().deleteComment(comment);
		res.sendStatus(200);
	} catch (err) {
		console.log(err);
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

		if (!commentReply) {
			throw new Error();
		}

		if (!user) {
			if (commentReply.password !== password) {
				return res.status(401).send({ message: '비밀번호가 틀립니다.' });
			}
		}

		if (user && commentReply.user.id !== user.id) {
			return res
				.status(401)
				.send({ message: '댓글을 작성한 유저가 아닙니다.' });
		}

		await commentRepository().deleteCommentReply(commentReply);
		res.sendStatus(200);
	} catch (err) {
		console.log(err);
		res.status(400).send({ message: '삭제 중 오류가 발생했습니다.' });
	}
};
