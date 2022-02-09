import request from 'supertest';
import express from 'express';
import cookieParser from 'cookie-parser';

import { commentRouter } from '../../router/commentRouter';
import { postRouter } from '../../router/postRouter';
import { userRouter } from '../../router/userRouter';

export const createTestServer = () => {
	const app = express();

	app.use(cookieParser());
	app.use(express.json());
	app.use(express.urlencoded({ extended: true }));

	app.use('/user', userRouter);
	app.use('/post', postRouter);
	app.use('/post/comment', commentRouter);

	app.get('/ping', (req, res) => {
		res.sendStatus(200);
	});

	return request(app);
};
