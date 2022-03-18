import express, { Response } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import 'reflect-metadata';
import cookieParser from 'cookie-parser';
import schedule from 'node-schedule';

import dbCreateConnection from './dbConnection';
import { userRouter } from './router/userRouter';
import { postRouter } from './router/postRouter';
import { commentRouter } from './router/commentRouter';
import { categoryRouter } from './router/categoryRouter';
import { tagRouter } from './router/tagRouter';
import { searchRouter } from './router/searchRouter';
import { checkView, cronTotalView } from './view';
import { isAuth } from './middleware/auth';
import morgan from './lib/morgan';

const server = express();

server.use(helmet());
server.use(
	cors({
		origin: true,
		credentials: true,
	})
);
server.use(morgan);

server.use(cookieParser());
server.use(express.json());
server.use(express.urlencoded({ extended: true }));

server.use('/user', userRouter);
server.use('/post', postRouter);
server.use('/post/comment', commentRouter);
server.use('/category', categoryRouter);
server.use('/tags', tagRouter);
server.use('/search', searchRouter);

// ====== 조회수 관련 ===== //
// ./view.ts
server.get('/view', isAuth, checkView);

schedule.scheduleJob('0 0 0 * * *', cronTotalView as any);
// ====== 조회수 관련 끝 ===== //

server.get('/', (_, res: Response) => {
	res.send('welcome');
});

server.listen(4000, () => {
	console.log('http://localhost:4000');
});

dbCreateConnection();
