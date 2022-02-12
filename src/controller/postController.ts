import { Request, Response } from 'express';
import { validationResult } from 'express-validator';

import { categoryRepository } from '../typeorm/repository/CategoryRepository';
import { postRepository } from '../typeorm/repository/PostRepository';
import { tagRepository } from '../typeorm/repository/TagRepository';

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
	const { id } = req.params;

	try {
		const post = await postRepository().findById(id);

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
	const user = req.user;

	try {
		// valid
		const errors = validationResult(req);
		if (!errors.isEmpty()) {
			return res.status(400).send({ message: errors.array()[0].msg });
		}

		// user auth check
		if (!user?.isAdmin) {
			return res.status(401).send({ message: '권한이 없는 유저입니다.' });
		}

		// create category
		const category = await categoryRepository().createCategory(data.category);

		// create tag
		const postTags = await tagRepository().createTags(data.tags);

		// create post
		const postId = await postRepository().createPost({
			...data,
			category,
			user,
			isPrivate: data.isPrivate || false,
			tags: postTags,
		});

		res.status(201).send(postId);
	} catch (err) {
		console.log(err);
		res.status(400).send({ message: '작성 중 오류가 발생했습니다.' });
	}
};

export const patchPost = async (req: Request, res: Response) => {
	const updateData: PatchPostDTO = req.body;
	const { id } = req.params;
	const user = req.user;

	try {
		// valid
		const errors = validationResult(req);
		if (!errors.isEmpty()) {
			return res.status(400).send({ message: errors.array()[0].msg });
		}

		if (!user?.isAdmin) {
			return res.status(401).send({ message: '권한이 없는 유저입니다.' });
		}

		// create Category
		const category = await categoryRepository().createCategory(
			updateData.category
		);

		// create tag
		const postTags = await tagRepository().createTags(updateData.tags);

		const postId = await postRepository().updatePost(id, {
			...updateData,
			category,
			tags: postTags,
		});

		res.status(200).send(postId);
	} catch (err) {
		res.status(400).send({ message: '업데이트 중 오류가 발생했습니다.' });
	}
};

export const deletePost = async (req: Request, res: Response) => {
	const { id } = req.params;
	const user = req.user;

	try {
		const exist = await postRepository().findOne({ id });

		if (!exist) {
			throw new Error();
		}

		if (!user?.isAdmin) {
			return res.status(401).send({ message: '권한이 없는 유저입니다.' });
		}

		await postRepository().deletePost(id);

		res.sendStatus(200);
	} catch (err) {
		res.status(400).send({ message: '삭제 중 오류가 발생했습니다.' });
	}
};
