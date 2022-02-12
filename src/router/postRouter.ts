import express from 'express';
import { check } from 'express-validator';

import {
	getPost,
	postCreate,
	patchPost,
	deletePost,
	getPosts,
	postImg,
} from '../controller/postController';
import { isAuth } from '../middleware/auth';
import { uploadImage } from '../multer';

export const postRouter = express.Router();

/**
 * prefix
 * /post
 */

// 전체
postRouter.get('/', getPosts);

postRouter.get('/:id', getPost);

postRouter.post(
	'/',
	[
		check('title', '제목을 입력해 주세요.').exists().notEmpty(),
		check('content', '본문을 입력해 주세요.').exists().notEmpty(),
		check('category', '카테고리를 선택해 주세요.').exists().notEmpty(),
	],
	isAuth,
	postCreate
);

postRouter.patch(
	'/:id',
	[
		check('title', '제목을 입력해 주세요.').exists().notEmpty(),
		check('category', '카테고리를 선택해 주세요.').exists().notEmpty(),
	],
	isAuth,
	patchPost
);

postRouter.delete('/:id', isAuth, deletePost);

// 테스트 하지 않음. AWS KEY 필요.
postRouter.post('/img', uploadImage, postImg);
