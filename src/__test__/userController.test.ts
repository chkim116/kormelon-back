import request from 'supertest';

import { userRouter } from '../router/userRouter';
import { dbConnect, dbClose, createTestServer, dbClear } from './features';

let server: request.SuperTest<request.Test>;
beforeAll(async () => {
	server = createTestServer('/user', userRouter);
	await dbConnect();
});

afterAll(async () => {
	await dbClose();
});

beforeEach(async () => {
	await dbClear();
});

describe('User test', () => {
	describe('POST /user/register', () => {
		it('정상적인 회원가입', async () => {
			const user = {
				email: 'abcs@gmail.com',
				password: '2',
			};

			const res = await server.post('/user/register').send(user);
			expect(res.status).toEqual(201);
		});

		it('DTO에 이메일이 빠져있을 때', async () => {
			const err = await server
				.post('/user/register')
				.send({ password: 'chkim116@naver.com' });

			expect(err.status).toEqual(400);
			expect(err.body.message).toEqual('올바른 이메일 형식을 입력해 주세요.');
		});

		it('DTO에 비밀번호가 빠져있을 때', async () => {
			const err = await server
				.post('/user/register')
				.send({ email: 'chkim116@naver.com' });

			expect(err.status).toEqual(400);
			expect(err.body.message).toEqual('비밀번호를 입력해 주세요.');
		});

		it('DTO에 비밀번호가 공백일 때', async () => {
			const err = await server
				.post('/user/register')
				.send({ email: 'chkim116@naver.com', password: '' });

			expect(err.status).toEqual(400);
			expect(err.body.message).toEqual('비밀번호를 입력해 주세요.');
		});

		it('DTO에 이메일 형식이 올바르지 않을 때', async () => {
			const err = await server
				.post('/user/register')
				.send({ email: 'chkim116' });

			expect(err.status).toEqual(400);
			expect(err.body.message).toEqual('올바른 이메일 형식을 입력해 주세요.');
		});
	});
});
