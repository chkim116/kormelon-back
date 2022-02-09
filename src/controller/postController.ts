import { Request, Response } from 'express';
import { validationResult } from 'express-validator';

import { categoryRepository } from '../typeorm/repository/CategoryRepository';
import { postRepository } from '../typeorm/repository/PostRepository';
import { tagRepository } from '../typeorm/repository/TagRepository';
import { userRepository } from '../typeorm/repository/UserRepository';

import { CreatePostDTO, PatchPostDTO } from './dto/postController.dto';

export const getPosts = async (req: Request, res: Response) => {
	const { page, per } = req.query as { page: string; per: string };
	try {
		const posts = await postRepository().findPosts(
			Number(page) || 1,
			Number(per) || 5
		);

		res.status(200).send(posts);
	} catch (err) {
		console.log(err);
		res
			.status(400)
			.send({ message: '게시글을 불러오는 중 오류가 발생했습니다.' });
	}
};

export const getPost = async (req: Request, res: Response) => {
	const { title } = req.params;

	try {
		const post = await postRepository().findByTitle(title);

		if (!post) {
			return res.status(400).send({ message: '존재하지 않는 게시글입니다.' });
		}

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
		// find user
		const user = await userRepository().findOne({ where: { id: data.userId } });

		if (!user) {
			throw new Error('user is not define');
		}

		// create category
		const category = await categoryRepository().createCategory(data.category);

		// create tag
		const postTags = await tagRepository().createTags(data.tags);

		// create post
		const postTitle = await postRepository().createPost({
			...data,
			category,
			user,
			isPrivate: data.isPrivate || false,
			tags: postTags,
		});

		res.status(201).send(postTitle);
	} catch (err) {
		console.log(err);
		res.status(400).send({ message: '작성 중 오류가 발생했습니다.' });
	}
};

export const patchPost = async (req: Request, res: Response) => {
	const updateData: PatchPostDTO = req.body;
	const { title } = req.params;

	try {
		// valid
		const errors = validationResult(req);
		if (!errors.isEmpty()) {
			return res.status(400).send({ message: errors.array()[0].msg });
		}

		// create Category
		const category = await categoryRepository().createCategory(
			updateData.category
		);

		// create tag
		const postTags = await tagRepository().createTags(updateData.tags);

		const postTitle = await postRepository().updatePost(title, {
			...updateData,
			category,
			tags: postTags,
		});

		res.status(200).send(postTitle);
	} catch (err) {
		res.status(400).send({ message: '업데이트 중 오류가 발생했습니다.' });
	}
};

export const deletePost = async (req: Request, res: Response) => {
	const { title } = req.params;

	try {
		const exist = await postRepository().findOne({ title });

		if (!exist) {
			throw new Error();
		}

		await postRepository().deletePost(title);

		res.sendStatus(200);
	} catch (err) {
		res.status(400).send({ message: '삭제 중 오류가 발생했습니다.' });
	}
};
