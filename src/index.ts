import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
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
import { checkView, cronTotalView } from './view';
import { isAuth } from './middleware/auth';

const server = express();

server.use(helmet());
server.use(cors());
server.use(morgan('combined'));

server.use(cookieParser());
server.use(express.json());
server.use(express.urlencoded({ extended: true }));

server.use('/user', userRouter);
server.use('/post', postRouter);
server.use('/post/comment', commentRouter);
server.use('/category', categoryRouter);
server.use('/tags', tagRouter);

// ====== 조회수 관련 ===== //
// ./view.ts
server.get('/view', isAuth, checkView);

schedule.scheduleJob('0 0 0 * * *', cronTotalView as any);
// ====== 조회수 관련 끝 ===== //

server.listen(4000, () => {
	console.log('http://localhost:4000');
});

dbCreateConnection();
