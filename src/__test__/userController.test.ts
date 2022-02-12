import request from 'supertest';

import { dbConnect, dbClose, createTestServer, dbClear } from './features';

const server: request.SuperTest<request.Test> = createTestServer();

beforeAll(async () => {
	await dbConnect();
	await dbClear();
});

afterAll(async () => {
	await dbClose();
});

const mockUser = { email: 'abc@gmail.com', password: '123' };

describe('User test', () => {
	describe('POST /user/register', () => {
		it('정상적인 회원가입', async () => {
			const res = await server.post('/user/register').send(mockUser);
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

	describe('POST /user/login', () => {
		const postLogin = <T extends object>(data: T) =>
			server.post('/user/login').send(data);

		it('정상적인 로그인', async () => {
			const res = await postLogin(mockUser);
			expect(res.status).toEqual(200);
			expect(res.body).toHaveProperty('id');
			expect(res.body).toHaveProperty('username');
			expect(res.body).toHaveProperty('email');
			expect(res.body).toHaveProperty('isAdmin');
			expect(res.header['set-cookie'].length).toBeTruthy();
		});

		it('비밀번호가 틀렸다.', async () => {
			const err = await postLogin({ ...mockUser, password: 'a' });

			expect(err.status).toEqual(401);
			expect(err.body.message).toEqual('비밀번호가 틀립니다.');
		});

		it('존재하지 않은 유저이다.', async () => {
			const err = await postLogin({
				email: 'no@gmail.com',
				password: 'b',
			});

			expect(err.status).toEqual(401);
			expect(err.body.message).toEqual('존재하지 않는 유저입니다.');
		});
	});

	describe('GET /user/auth', () => {
		const login = () =>
			server
				.post('/user/login')
				.send(mockUser)
				.then((res) => res.header['set-cookie'][0]);

		it('정상적인 권한 획득', async () => {
			const token = await login();
			const res = await server.get('/user/auth').set('Cookie', token);

			expect(res.status).toEqual(200);
			expect(res.body).toHaveProperty('id');
			expect(res.body).toHaveProperty('username');
			expect(res.body).toHaveProperty('email');
			expect(res.body).toHaveProperty('isAdmin');
		});

		it('쿠키 포함이 되지 않은 요청 시', async () => {
			const err = await server.get('/user/auth');
			expect(err.body).toEqual(false);
		});
	});

	describe('POST /user/logout', () => {
		it('정상적인 로그아웃', async () => {
			const res = await server.post('/user/logout');

			expect(res.status).toEqual(200);
		});
	});
});
