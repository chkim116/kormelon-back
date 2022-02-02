import request from 'supertest';
import express, { Router } from 'express';

export const createTestServer = (route: string, router: Router) => {
	const app = express();

	app.use(express.json());
	app.use(express.urlencoded({ extended: true }));

	app.use(route, router);

	return request(app);
};
