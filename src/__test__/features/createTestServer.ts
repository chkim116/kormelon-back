import request from 'supertest';
import express, { Router } from 'express';
import cookieParser from 'cookie-parser';

export const createTestServer = (route?: string, router?: Router) => {
	const app = express();

	app.use(cookieParser());
	app.use(express.json());
	app.use(express.urlencoded({ extended: true }));

	if (route && router) {
		app.use(route, router);
	}

	app.get('/ping', (req, res) => {
		res.sendStatus(200);
	});

	return request(app);
};
