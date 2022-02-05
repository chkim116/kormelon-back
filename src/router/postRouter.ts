import express from 'express';
import { check } from 'express-validator';

import { postCreate } from '../controller/postController';

export const postRouter = express.Router();

// * prefix /post
// ! FIX: user middleware

postRouter.get('/');

postRouter.get('/:id');

postRouter.post(
	'/',
	[
		check('title', '제목을 입력해 주세요.').exists().notEmpty(),
		check('content', '본문을 입력해 주세요.').exists().notEmpty(),
		check('categoryId', '카테고리를 선택해 주세요.').exists().notEmpty(),
	],
	postCreate
);

postRouter.patch('/:id');

postRouter.delete('/:id');
