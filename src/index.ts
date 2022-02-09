import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import helmet from 'helmet';
import 'reflect-metadata';
import cookieParser from 'cookie-parser';

import dbCreateConnection from './typeorm/dbCreateConnection';
import { userRouter } from './router/userRouter';
import { postRouter } from './router/postRouter';
import { commentRouter } from './router/commentRouter';

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

server.listen(4000, () => {
	console.log('http://localhost:4000');
});

dbCreateConnection();
