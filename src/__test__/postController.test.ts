import request from 'supertest';
import { getRepository } from 'typeorm';

import { postRouter } from '../router/postRouter';
import { Category } from '../typeorm/entities/Category';
import { User } from '../typeorm/entities/User';
import { createTestServer, dbClear, dbClose, dbConnect } from './features';

let server: request.SuperTest<request.Test>;
let userId: string;
let categoryId: string;

beforeAll(async () => {
	server = createTestServer('/post', postRouter);
	await dbConnect();
	userId = await getUserId();
	categoryId = await getCategoryId();
});

afterAll(async () => {
	await dbClear();
	await dbClose();
});

async function getUserId() {
	const user = new User();
	user.email = 'chkim116@naver.com';
	user.username = 'chkim116';
	user.password = '1';
	const result = await getRepository(User, process.env.NODE_ENV).save(user);
	return result.id;
}

async function getCategoryId() {
	const category = new Category();
	category.value = '임시';
	const result = await getRepository(Category, process.env.NODE_ENV).save(
		category
	);
	return result.id;
}

describe('Post test', () => {
	const mockPost = {
		title: '제목',
		content: '컨텐츠',
	};

	describe('POST /post', () => {
		it('정상적인 컨텐츠 생성', async () => {
			const res = await server
				.post('/post')
				.send({ ...mockPost, userId, categoryId });
			expect(res.status).toEqual(201);
			expect(res.text).toEqual('제목');
		});

		it('제목 빼먹음', async () => {
			const err = await server
				.post('/post')
				.send({ ...mockPost, userId, categoryId, title: '' });

			expect(err.status).toEqual(400);
			expect(err.body.message).toEqual('제목을 입력해 주세요.');
		});

		it('컨텐츠 빼먹음', async () => {
			const err = await server
				.post('/post')
				.send({ ...mockPost, userId, categoryId, content: '' });

			expect(err.status).toEqual(400);
			expect(err.body.message).toEqual('본문을 입력해 주세요.');
		});

		it('카테고리 빼먹음', async () => {
			const err = await server.post('/post').send({ ...mockPost, userId });

			expect(err.status).toEqual(400);
			expect(err.body.message).toEqual('카테고리를 선택해 주세요.');
		});
	});

	describe('GET /post/:title', () => {
		const title = encodeURIComponent('제목');
		it('정상적인 포스트 리드', async () => {
			const res = await server.get(`/post/${title}`);
			expect(res.status).toEqual(200);
			expect(res.body.title).toEqual('제목');
			expect(res.body.view).toEqual(1);
			expect(res.body.category.value).toBe('임시');
			expect(res.body.content).toEqual('컨텐츠');
			expect(res.body.user.username).toEqual('chkim116');
			expect(res.body.tags).toEqual([]);
		});

		it('포스트 리드 실패', async () => {
			const err = await server.get('/post/213');
			expect(err.status).toBe(400);
			expect(err.body.message).toEqual('존재하지 않는 게시글입니다.');
		});
	});
});
