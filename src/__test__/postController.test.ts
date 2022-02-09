import request from 'supertest';
import { getRepository } from 'typeorm';

import { postRouter } from '../router/postRouter';
import { User } from '../typeorm/entities/User';
import { createTestServer, dbClear, dbClose, dbConnect } from './features';

let server: request.SuperTest<request.Test>;
let userId: string;

beforeAll(async () => {
	server = createTestServer('/post', postRouter);
	await dbConnect();
	userId = await getUserId();
});

afterAll(async () => {
	// await dbClear();
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
			expect(res.status).toEqual(201);
			expect(res.text).toEqual('제목');
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
			expect(res.body.tags[0].value).toEqual('태그1');
		});

		it('포스트 리드 실패', async () => {
			const err = await server.get('/post/213');
			expect(err.status).toBe(400);
			expect(err.body.message).toEqual('존재하지 않는 게시글입니다.');
		});
	});

	describe('PATCH /post/:title', () => {
		const title = encodeURIComponent('제목');
		it('정상적인 업데이트', async () => {
			const res = await server.patch(`/post/${title}`).send({
				title: '제목바뀜',
				category: '임시2',
				tags: ['태그1', '태그2', '태그3'],
			});

			expect(res.status).toBe(200);
			expect(res.text).toEqual('제목바뀜');
		});

		it('잘못된 타이틀 요청으로 인한 업데이트 실패', async () => {
			const err = await server.patch(`/post/${title}as~`).send({
				title: '제목바뀜',
				category: '임시2',
				tags: ['태그1', '태그2', '태그3'],
			});

			expect(err.status).toBe(400);
			expect(err.body.message).toBe('업데이트 중 오류가 발생했습니다.');
		});

		it('제목 빼먹음', async () => {
			const err = await server.patch(`/post/${title}as~`).send({
				title: '',
				category: '임시2',
			});

			expect(err.status).toEqual(400);
			expect(err.body.message).toEqual('제목을 입력해 주세요.');
		});

		it('카테고리 빼먹음', async () => {
			const err = await server.patch(`/post/${title}as~`).send({
				title: '제목바뀜',
			});
			expect(err.status).toEqual(400);
			expect(err.body.message).toEqual('카테고리를 선택해 주세요.');
		});
	});

	describe('DELETE /post/:title', () => {
		const title = encodeURIComponent('제목바뀜');
		it('정상적인 삭제', async () => {
			const res = await server.delete(`/post/${title}`);
			expect(res.status).toBe(200);
		});

		it('삭제 실패', async () => {
			const err = await server.delete(`/post/${title}asd`);
			expect(err.status).toBe(400);
			expect(err.body.message).toEqual('삭제 중 오류가 발생했습니다.');
		});
	});
});
