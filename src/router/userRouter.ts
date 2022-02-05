import express from 'express';
import { check } from 'express-validator';

import {
	postRegister,
	postLogin,
	getAuth,
	postLogout,
} from '../controller/userController';

export const userRouter = express.Router();

userRouter.post(
	'/register',
	[
		check('email', '올바른 이메일 형식을 입력해 주세요.').isEmail(),
		check('password', '비밀번호를 입력해 주세요.').exists().notEmpty(),
	],
	postRegister
);

userRouter.post(
	'/login',
	[
		check('email', '올바른 이메일 형식을 입력해 주세요.').isEmail(),
		check('password', '비밀번호를 입력해 주세요.').exists().notEmpty(),
	],
	postLogin
);

userRouter.get('/auth', getAuth);

userRouter.post('/logout', postLogout);
