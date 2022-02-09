import { Request, Response } from 'express';
import { commentRepository } from '../typeorm/repository/CommentRepository';
import { postRepository } from '../typeorm/repository/PostRepository';
import { userRepository } from '../typeorm/repository/UserRepository';

import { CreateCommentDTO } from './dto/commentController.dto';

export const postCreateComment = async (req: Request, res: Response) => {
	const { title } = req.params;
	const { text, userId }: CreateCommentDTO = req.body;

	try {
		const post = await postRepository().findByTitle(title);

		const user = await userRepository().findOne({
			where: { id: userId },
		});

		if (!post || !user) {
			throw new Error('post or user가 없습니다.');
		}

		await commentRepository().createComment(post, user, text);
		res.sendStatus(201);
	} catch (err) {
		console.log(err);
		res.status(400).send({ message: '댓글 작성 중 오류가 발생했습니다.' });
	}
};

export const postCreateReply = async (req: Request, res: Response) => {
	const { id } = req.params;
	const { userId, text }: CreateCommentDTO = req.body;

	try {
		const comment = await commentRepository().findOne({
			where: { id },
		});

		const user = await userRepository().findOne({
			where: { id: userId },
		});

		if (!comment || !user) {
			throw new Error('comment or user가 없습니다.');
		}

		await commentRepository().createCommentReply(comment, user, text);

		res.sendStatus(201);
	} catch (err) {
		console.log(err);
		res.status(400).send({ message: '대댓글 작성 중 오류가 발생했습니다.' });
	}
};
