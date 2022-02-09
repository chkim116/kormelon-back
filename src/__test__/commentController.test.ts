import request from 'supertest';
import { getRepository } from 'typeorm';
import { Comment } from '../typeorm/entities/Comment';
import { User } from '../typeorm/entities/User';
import { commentRepository } from '../typeorm/repository/CommentRepository';

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

describe('Post comment test', () => {
	const mockComment = {
		postTitle: '제목',
		text: '멋진 코멘트',
	};

	describe('POST /post/comment/:title', () => {
		const title = encodeURIComponent('제목');
		it('정상적인 댓글 생성', async () => {
			await server.post('/post').send({
				title: '제목',
				content: '컨텐츠',
				category: '임시',
				userId,
			});

			const res = await server
				.post(`/post/comment/${title}`)
				.send({ ...mockComment, userId });

			expect(res.status).toBe(201);
		});

		it('게시글이 없으면 댓글 생성 하지 않음', async () => {
			const err = await server
				.post(`/post/comment/${title}2`)
				.send({ ...mockComment, userId });

			expect(err.status).toBe(400);
			expect(err.body.message).toEqual('댓글 작성 중 오류가 발생했습니다.');
		});

		it('알 수 없는 오류로 댓글 생성 실패', async () => {
			const err = await server.post('/post/comment/1a2').send({});

			expect(err.status).toBe(400);
			expect(err.body.message).toEqual('댓글 작성 중 오류가 발생했습니다.');
		});
	});

	describe('POST /post/comment/reply/:id', () => {
		it('정상적인 대댓글 생성', async () => {
			const parentComment = await getRepository(
				Comment,
				process.env.NODE_ENV
			).findOne({
				where: { text: '멋진 코멘트' },
			});

			const res = await server
				.post(`/post/comment/reply/${parentComment!.id}`)
				.send({ text: '대댓글', userId });

			expect(res.status).toBe(201);
		});

		it('올바르지 않은 params', async () => {
			const err = await server
				.post(`/post/comment/reply/12`)
				.send({ text: '대댓글', userId });

			expect(err.status).toBe(400);
			expect(err.body.message).toEqual('대댓글 작성 중 오류가 발생했습니다.');
		});

		it('유저가 없어 댓글 생성 실패', async () => {
			const parentComment = await commentRepository().findOne({
				where: { text: '멋진 코멘트' },
			});

			const err = await server
				.post(`/post/comment/reply/${parentComment!.id}`)
				.send({ text: '대댓글' });

			expect(err.status).toBe(400);
			expect(err.body.message).toEqual('대댓글 작성 중 오류가 발생했습니다.');
		});
	});
});
