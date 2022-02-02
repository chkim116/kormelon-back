import request from 'supertest';

import { userRouter } from '../router/userRouter';
import { dbClose, dbConnect, createTestServer } from './features';

let server: request.SuperTest<request.Test>;

beforeAll(() => {
	server = createTestServer('/user', userRouter);
	dbConnect();
});

afterAll(() => {
	dbClose();
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
