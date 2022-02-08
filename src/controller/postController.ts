import { Request, Response } from 'express';
import { validationResult } from 'express-validator';

import { postRepository } from '../typeorm/repository/PostRepository';
import { tagRepository } from '../typeorm/repository/TagRepository';

import { Tag } from '../typeorm/entities/Tag';
import { CreatePostDTO } from './dto/postController.dto';

export const getPostByTitle = async (req: Request, res: Response) => {
	const { title } = req.params;

	try {
		const post = await postRepository().findByTitle(title);

		if (!post) {
			return res.status(400).send({ message: '존재하지 않는 게시글입니다.' });
		}

		console.log(post.tags);

		res.status(200).send(post);
	} catch (err) {
		console.log(err);
		res
			.status(400)
			.send({ message: '게시글을 불러오는 중 오류가 발생했습니다.' });
	}
};

export const postCreate = async (req: Request, res: Response) => {
	const data: CreatePostDTO = req.body;
	try {
		// valid
		const errors = validationResult(req);
		if (!errors.isEmpty()) {
			return res.status(400).send({ message: errors.array()[0].msg });
		}

		// create tag
		let tags: Tag[] = [];
		const map = [...new Set(data.tags)].map(async (value: string) => {
			const exist = await tagRepository().checkExist(value);
			if (exist) {
				return exist;
			}
			return await tagRepository().createTag(value);
		});
		await Promise.all(map).then((res) => {
			res.forEach((tag) => {
				tag && tags.push(tag);
			});
		});

		// create post
		const postTitle = await postRepository().createPost({
			...data,
			isPrivate: data.isPrivate || false,
			tags,
		});

		res.status(201).send(postTitle);
	} catch (err) {
		console.log(err);
		res.status(400).send({ message: '작성 중 오류가 발생했습니다.' });
	}
};
