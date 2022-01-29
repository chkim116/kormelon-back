import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import helmet from 'helmet';
import 'reflect-metadata';

import dbCreateConnection from './typeorm/dbCreateConnection';

const server = express();

server.use(helmet());
server.use(cors());
server.use(morgan('combined'));

server.use(express.json());
server.use(express.urlencoded({ extended: true }));

server.listen(4000, () => {
	console.log('http://localhost:4000');
});

dbCreateConnection();
