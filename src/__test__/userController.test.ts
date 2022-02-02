import request from 'supertest';
import express from 'express';
import { userRouter } from '../router/userRouter';

let server: request.SuperTest<request.Test>;

beforeAll(() => {
	const app = express();
	app.use(express.json());
	app.use(express.urlencoded({ extended: true }));
	app.use('/user', userRouter);
	server = request(app);
});

describe('express test', () => {
	test('GET /user/ping', (done) => {
		server.get('/user/ping').expect(200, 'pong').end(done);
	});

	test('POST /user/login', (done) => {
		const mock = {
			email: 'cskim132@gmail.com',
			password: '1234',
		};
		server
			.post('/user/login')
			.send(mock)
			.expect(200, mock)
			.end((err) => {
				if (err) return done(err);
				return done();
			});
	});
});
