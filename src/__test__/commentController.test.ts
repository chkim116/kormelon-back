import request from 'supertest';
import { getRepository } from 'typeorm';

import { User } from '../typeorm/entities/User';
import {
	commentReplyRepository,
	commentRepository,
} from '../typeorm/repository/CommentRepository';

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

	describe('POST /post/comment/:id', () => {
		it('정상적인 댓글 생성', async () => {
			const post = await server.post('/post').send({
				title: '제목',
				content: '컨텐츠',
				category: '임시',
				userId,
			});

			const res = await server
				.post(`/post/comment/${post.text}`)
				.send({ ...mockComment, userId });

			expect(res.status).toBe(201);
		});

		it('게시글이 없으면 댓글 생성 하지 않음', async () => {
			const err = await server
				.post(`/post/comment/${'asd'}`)
				.send({ ...mockComment, userId });

			expect(err.status).toBe(400);
			expect(err.body.message).toEqual('댓글 작성 중 오류가 발생했습니다.');
		});

		it('알 수 없는 오류로 댓글 생성 실패', async () => {
			const err = await server.post('/post/comment/asd').send({});

			expect(err.status).toBe(400);
			expect(err.body.message).toEqual('댓글 작성 중 오류가 발생했습니다.');
		});
	});

	describe('POST /post/comment/reply/:id', () => {
		it('정상적인 대댓글 생성', async () => {
			const parentComment = await commentRepository().findOne({
				where: { text: '멋진 코멘트' },
			});

			const res = await server
				.post(`/post/comment/reply/${parentComment!.id}`)
				.send({ text: '대댓글', userId });

			await server
				.post(`/post/comment/reply/${parentComment!.id}`)
				.send({ text: '대댓글a', userId });

			expect(res.status).toBe(201);
		});

		it('올바르지 않은 params', async () => {
			const err = await server
				.post(`/post/comment/reply/asd`)
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

	describe('PATCH /post/comment/:id', () => {
		it('정상적인 댓글 업데이트', async () => {
			const comment = await commentRepository().findOne({
				where: { text: '멋진 코멘트' },
			});

			const res = await server
				.patch(`/post/comment/${comment!.id}`)
				.send({ text: '멋진 코멘트2', userId });

			expect(res.status).toBe(200);
		});

		it('댓글이 존재하지 않을때.', async () => {
			const err = await server
				.patch(`/post/comment/${'asd'}`)
				.send({ text: '멋진 코멘트2', userId });

			expect(err.status).toBe(400);
			expect(err.body.message).toEqual('댓글이 존재하지 않습니다.');
		});

		it('댓글을 작성한 유저가 아닐때.', async () => {
			const comment = await commentRepository().findOne({
				where: { text: '멋진 코멘트2' },
			});

			const err = await server
				.patch(`/post/comment/${comment!.id}`)
				.send({ text: '멋진 코멘트2', userId: 'asd' });

			expect(err.status).toBe(400);
			expect(err.body.message).toEqual('댓글을 작성한 유저가 아닙니다.');
		});
	});

	describe('PATCH /post/comment/reply/:id', () => {
		it('정상적인 대댓글 업데이트', async () => {
			const commentReply = await commentReplyRepository().findOne({
				where: { text: '대댓글' },
			});

			const res = await server
				.patch(`/post/comment/reply/${commentReply!.id}`)
				.send({ text: '대댓글2', userId });

			expect(res.status).toBe(200);
		});

		it('댓글이 존재하지 않을때.', async () => {
			const err = await server
				.patch(`/post/comment/reply/${'asd'}`)
				.send({ text: '대댓글2', userId });

			expect(err.status).toBe(400);
			expect(err.body.message).toEqual('댓글이 존재하지 않습니다.');
		});

		it('댓글을 작성한 유저가 아닐 때.', async () => {
			const commentReply = await commentReplyRepository().findOne({
				where: { text: '대댓글2' },
			});

			const err = await server
				.patch(`/post/comment/reply/${commentReply!.id}`)
				.send({ text: '대댓글2', userId: 'asd' });

			expect(err.status).toBe(400);
			expect(err.body.message).toEqual('댓글을 작성한 유저가 아닙니다.');
		});
	});

	describe('DELETE /post/comment/:id', () => {
		it('정상적인 댓글 삭제', async () => {
			const comment = await commentRepository().findOne({
				where: { text: '멋진 코멘트2' },
			});

			const res = await server.delete(`/post/comment/${comment!.id}`);

			expect(res.status).toBe(200);
		});

		it('삭제 실패', async () => {
			const err = await server.delete('/post/comment/asd');

			expect(err.status).toBe(400);
			expect(err.body.message).toEqual('삭제 중 오류가 발생했습니다.');
		});
	});

	describe('DELETE /post/comment/reply/:id', () => {
		it('정상적인 대댓글 삭제', async () => {
			const comment = await commentReplyRepository().findOne({
				where: { text: '대댓글2' },
			});

			const res = await server.delete(`/post/comment/reply/${comment!.id}`);

			expect(res.status).toBe(200);
		});

		it('대댓글 삭제 실패', async () => {
			const err = await server.delete('/post/comment/reply/asd');

			expect(err.status).toBe(400);
			expect(err.body.message).toEqual('삭제 중 오류가 발생했습니다.');
		});
	});
});
