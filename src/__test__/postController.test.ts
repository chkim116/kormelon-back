import request from 'supertest';

import { postRouter } from '../router/postRouter';
import { createTestServer, dbClear, dbClose, dbConnect } from './features';

let server: request.SuperTest<request.Test>;

beforeAll(async () => {
	server = createTestServer('/post', postRouter);
	await dbConnect();
});

afterAll(async () => {
	await dbClear();
	await dbClose();
});

describe('Post test', () => {
	const mockPost = {
		title: '제목',
		content: '컨텐츠',
		categoryId: '1',
		userId: '1',
	};

	describe('POST /post', () => {
		it('정상적인 컨텐츠 생성', async () => {
			const res = await server.post('/post').send(mockPost);
			expect(res.status).toEqual(201);
			expect(res.text).toEqual('제목');
		});

		it('제목 빼먹음', async () => {
			const err = await server.post('/post').send({ ...mockPost, title: '' });

			expect(err.status).toEqual(400);
			expect(err.body.message).toEqual('제목을 입력해 주세요.');
		});

		it('컨텐츠 빼먹음', async () => {
			const err = await server.post('/post').send({ ...mockPost, content: '' });

			expect(err.status).toEqual(400);
			expect(err.body.message).toEqual('본문을 입력해 주세요.');
		});

		it('카테고리 빼먹음', async () => {
			const err = await server
				.post('/post')
				.send({ ...mockPost, categoryId: '' });

			expect(err.status).toEqual(400);
			expect(err.body.message).toEqual('카테고리를 선택해 주세요.');
		});
	});
});
