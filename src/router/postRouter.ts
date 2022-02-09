import express from 'express';
import { check } from 'express-validator';

import {
	getPost,
	postCreate,
	patchPost,
	deletePost,
	getPosts,
} from '../controller/postController';

export const postRouter = express.Router();

// * prefix /post
// ! FIX: user middleware

// 전체
postRouter.get('/', getPosts);

postRouter.get('/:title', getPost);

postRouter.post(
	'/',
	[
		check('title', '제목을 입력해 주세요.').exists().notEmpty(),
		check('content', '본문을 입력해 주세요.').exists().notEmpty(),
		check('category', '카테고리를 선택해 주세요.').exists().notEmpty(),
	],
	postCreate
);

postRouter.patch(
	'/:title',
	[
		check('title', '제목을 입력해 주세요.').exists().notEmpty(),
		check('category', '카테고리를 선택해 주세요.').exists().notEmpty(),
	],
	patchPost
);

postRouter.delete('/:title', deletePost);
