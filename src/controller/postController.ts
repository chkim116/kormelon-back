import { Request, Response } from 'express';
import { validationResult } from 'express-validator';
import { getCustomRepository } from 'typeorm';

import { PostRepository } from '../typeorm/repository/PostRepository';
import { CreatePostDTO } from './dto/postController.dto';

function postRepository() {
	return getCustomRepository(PostRepository, process.env.NODE_ENV);
}

export const postCreate = async (req: Request, res: Response) => {
	const data: CreatePostDTO = req.body;

	try {
		// valid
		const errors = validationResult(req);
		if (!errors.isEmpty()) {
			return res.status(400).send({ message: errors.array()[0].msg });
		}

		const postTitle = await postRepository().createPost({
			...data,
			isPrivate: data.isPrivate || false,
			tags: data.tags || [],
		});

		res.status(201).send(postTitle);
	} catch (err) {
		console.log(err);
		res.status(400).send({ message: '작성 중 오류가 발생했습니다.' });
	}
};
