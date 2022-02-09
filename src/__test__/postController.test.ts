import request from 'supertest';
import { getRepository } from 'typeorm';
import { Post } from '../typeorm/entities/Post';

import { User } from '../typeorm/entities/User';
import { createTestServer, dbClear, dbClose, dbConnect } from './features';

async function getUserId() {
	const user = new User();
	user.email = 'chkim116@naver.com';
	user.username = 'chkim116';
	user.password = '1';
	const result = await getRepository(User, process.env.NODE_ENV).save(user);
	return result.id;
}

const server: request.SuperTest<request.Test> = createTestServer();
let userId: string;

beforeAll(async () => {
	await dbConnect();
	userId = await getUserId();
});

afterAll(async () => {
	await dbClear();
	await dbClose();
});

describe('Post test', () => {
	const mockPost = {
		title: '제목',
		content: '컨텐츠',
		tags: ['태그1'],
		category: '임시',
	};

	describe('POST /post', () => {
		it('정상적인 컨텐츠 생성', async () => {
			const res = await server.post('/post').send({ ...mockPost, userId });
			const post = await getRepository(Post, process.env.NODE_ENV).findOne({
				where: { title: mockPost.title },
			});

			expect(res.status).toEqual(201);
			expect(res.text).toEqual(post!.id);
		});

		it('제목 빼먹음', async () => {
			const err = await server
				.post('/post')
				.send({ ...mockPost, userId, title: '' });

			expect(err.status).toEqual(400);
			expect(err.body.message).toEqual('제목을 입력해 주세요.');
		});

		it('컨텐츠 빼먹음', async () => {
			const err = await server
				.post('/post')
				.send({ ...mockPost, userId, content: '' });

			expect(err.status).toEqual(400);
			expect(err.body.message).toEqual('본문을 입력해 주세요.');
		});

		it('카테고리 빼먹음', async () => {
			const err = await server
				.post('/post')
				.send({ ...mockPost, userId, category: '' });

			expect(err.status).toEqual(400);
			expect(err.body.message).toEqual('카테고리를 선택해 주세요.');
		});
	});

	describe('GET /post/:id', () => {
		const title = '제목';
		it('정상적인 포스트 리드', async () => {
			const post = await getRepository(Post, process.env.NODE_ENV).findOne({
				where: { title },
			});

			const res = await server.get(`/post/${post!.id}`);
			expect(res.status).toEqual(200);
			expect(res.body.title).toEqual('제목');
			expect(res.body.view).toEqual(1);
			expect(res.body.category.value).toBe('임시');
			expect(res.body.content).toEqual('컨텐츠');
			expect(res.body.user.username).toEqual('chkim116');
			expect(res.body.tags[0].value).toEqual('태그1');
			expect(res.body.comments).toEqual([]);
		});

		it('포스트 리드 실패', async () => {
			const err = await server.get('/post/213');
			expect(err.status).toBe(400);
			expect(err.body.message).toEqual('존재하지 않는 게시글입니다.');
		});
	});

	describe('PATCH /post/:id', () => {
		const title = '제목';
		const updateTitle = '제목바뀜';
		it('정상적인 업데이트', async () => {
			const post = await getRepository(Post, process.env.NODE_ENV).findOne({
				where: { title },
			});

			const res = await server.patch(`/post/${post!.id}`).send({
				title: '제목바뀜',
				category: '임시2',
				tags: ['태그1', '태그2', '태그3'],
			});

			expect(res.status).toBe(200);
			expect(res.text).toEqual(post!.id);
		});

		it('잘못된 /:id 요청으로 인한 업데이트 실패', async () => {
			const err = await server.patch(`/post/${'asd'}`).send({
				title: '제목바뀜',
				category: '임시2',
				tags: ['태그1', '태그2', '태그3'],
			});

			expect(err.status).toBe(400);
			expect(err.body.message).toBe('업데이트 중 오류가 발생했습니다.');
		});

		it('제목 빼먹음', async () => {
			const post = await getRepository(Post, process.env.NODE_ENV).findOne({
				where: { title: updateTitle },
			});

			const err = await server.patch(`/post/${post!.id}`).send({
				title: '',
				category: '임시2',
			});

			expect(err.status).toEqual(400);
			expect(err.body.message).toEqual('제목을 입력해 주세요.');
		});

		it('카테고리 빼먹음', async () => {
			const post = await getRepository(Post, process.env.NODE_ENV).findOne({
				where: { title: updateTitle },
			});

			const err = await server.patch(`/post/${post!.id}`).send({
				title: '제목바뀜',
			});
			expect(err.status).toEqual(400);
			expect(err.body.message).toEqual('카테고리를 선택해 주세요.');
		});
	});

	describe('DELETE /post/:id', () => {
		const title = '제목바뀜';
		it('정상적인 삭제', async () => {
			const post = await getRepository(Post, process.env.NODE_ENV).findOne({
				where: { title },
			});

			const res = await server.delete(`/post/${post!.id}`);
			expect(res.status).toBe(200);
		});

		it('삭제 실패', async () => {
			const err = await server.delete(`/post/${'asd'}`);
			expect(err.status).toBe(400);
			expect(err.body.message).toEqual('삭제 중 오류가 발생했습니다.');
		});
	});

	describe('GET /post/', () => {
		const page = '1';
		const per = '2';

		beforeAll(async () => {
			const createPosts = Array.from({ length: 3 }).map(async (_, i) => {
				return await server
					.post('/post')
					.send({ ...mockPost, userId, title: i });
			});
			await Promise.all(createPosts);
		});

		it('query를 아무것도 넘기지 않아도 자동으로 1페이지 반환', async () => {
			// per는 기본적으로 5개 고정.
			const res = await server.get(`/post`);

			expect(res.status).toBe(200);
			expect(res.body.total).toBe(3);
			expect(res.body.results).toHaveLength(3);
		});

		it('첫번째 페이지, 2개의 게시글.', async () => {
			const res = await server.get(`/post?page=${page}&per=${per}`);

			expect(res.status).toBe(200);
			expect(res.body.total).toBe(3);
			expect(res.body.results).toHaveLength(2);
		});

		it('두번째 페이지, 1개의 게시글.', async () => {
			const res = await server.get(`/post?page=${2}&per=${per}`);

			expect(res.status).toBe(200);
			expect(res.body.total).toBe(3);
			expect(res.body.results).toHaveLength(1);
		});
	});
});
