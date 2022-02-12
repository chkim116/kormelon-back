import request from 'supertest';
import {
	commentReplyRepository,
	commentRepository,
} from '../typeorm/repository/CommentRepository';
import { userRepository } from '../typeorm/repository/UserRepository';

import { createTestServer, dbClear, dbClose, dbConnect } from './features';

async function createPost() {
	const token = await adminUserLogin();
	const post = await server
		.post('/post')
		.send({
			title: '제목',
			content: '컨텐츠',
			category: '임시',
		})
		.set('Cookie', token);
	// text => post의 id값
	return post.text;
}

async function createUser(email: string = 'chkim116@naver.com') {
	await server.post('/user/register').send({ email, password: '1' });
}

async function userLogin() {
	const token = await server
		.post('/user/login')
		.send({ email: 'c@gmail.com', password: '1' })
		.then((res) => {
			return res.header['set-cookie'][0];
		});

	return token;
}

async function adminUserLogin() {
	const token = await server
		.post('/user/login')
		.send({ email: 'chkim116@naver.com', password: '1' })
		.then((res) => {
			return res.header['set-cookie'][0];
		});

	// Test용 권한 추가
	const user = await userRepository().findOne({ email: 'chkim116@naver.com' });
	await userRepository().save({ ...user!, isAdmin: true });

	return token;
}

const server: request.SuperTest<request.Test> = createTestServer();
let userId: string;

beforeAll(async () => {
	await dbConnect();
	await dbClear();

	// 댓글용 포스트
	await createUser();
	// 비교용 유저
	await createUser('c@gmail.com');
});

afterAll(async () => {
	await dbClose();
});

describe('Post comment test', () => {
	const mockComment = {
		postTitle: '제목',
		text: '멋진 코멘트',
	};

	describe('POST /post/comment/:id', () => {
		it('정상적인 댓글 생성', async () => {
			const token = await adminUserLogin();
			const postId = await createPost();

			const res = await server
				.post(`/post/comment/${postId}`)
				.send(mockComment)
				.set('Cookie', token);

			expect(res.status).toBe(201);
		});

		it('익명 유저의 댓글', async () => {
			const postId = await createPost();

			// cookie가 없으므로 로그인 상태 X.
			const res = await server.post(`/post/comment/${postId}`).send({
				...mockComment,
				text: '멋진 익명 코멘트',
				username: '익명이오',
				password: '1234',
			});

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
				where: { username: 'chkim116' },
			});

			const token = await adminUserLogin();

			const res = await server
				.post(`/post/comment/reply/${parentComment!.id}`)
				.send({ text: '대댓글' })
				.set('Cookie', token);

			expect(res.status).toBe(201);
		});

		it('올바르지 않은 params', async () => {
			const err = await server
				.post(`/post/comment/reply/asd`)
				.send({ text: '대댓글', userId });

			expect(err.status).toBe(400);
			expect(err.body.message).toEqual('대댓글 작성 중 오류가 발생했습니다.');
		});

		it('익명 유저의 대댓글 생성', async () => {
			const parentComment = await commentRepository().findOne({
				where: { text: '멋진 코멘트' },
			});

			// cookie가 없으므로 익명이다.
			const res = await server
				.post(`/post/comment/reply/${parentComment!.id}`)
				.send({
					text: '익명 대댓글',
					username: '익명의 대댓글 작성자',
					password: '1234',
				});

			expect(res.status).toBe(201);
		});
	});

	describe('PATCH /post/comment/:id', () => {
		it('정상적인 댓글 업데이트', async () => {
			const token = await adminUserLogin();

			const comment = await commentRepository().findOne({
				where: { text: '멋진 코멘트' },
			});

			const res = await server
				.patch(`/post/comment/${comment!.id}`)
				.send({ text: '멋진 코멘트2' })
				.set('Cookie', token);

			expect(res.status).toBe(200);
		});

		it('익명 유저의 댓글 업데이트', async () => {
			const comment = await commentRepository().findOne({
				where: { text: '멋진 익명 코멘트' },
			});

			const res = await server
				.patch(`/post/comment/${comment!.id}`)
				.send({ text: '멋진 익명 코멘트2', password: '1234' });

			expect(res.status).toBe(200);
		});

		it('익명 유저의 댓글 비밀번호가 틀려서 업데이트 실패', async () => {
			const comment = await commentRepository().findOne({
				where: { text: '멋진 익명 코멘트2' },
			});

			const err = await server
				.patch(`/post/comment/${comment!.id}`)
				.send({ text: '멋진 익명 코멘트3', password: '틀린 비밀번호' });

			expect(err.status).toBe(401);
			expect(err.body.message).toEqual('비밀번호가 틀립니다.');
		});

		it('댓글이 존재하지 않을때.', async () => {
			const err = await server
				.patch(`/post/comment/${'asd'}`)
				.send({ text: '멋진 코멘트2' });

			expect(err.status).toBe(400);
			expect(err.body.message).toEqual('댓글이 존재하지 않습니다.');
		});

		it('댓글을 작성한 유저가 아닐때.', async () => {
			const token = await userLogin();

			const comment = await commentRepository().findOne({
				where: { text: '멋진 코멘트2' },
			});

			const err = await server
				.patch(`/post/comment/${comment!.id}`)
				.send({ text: '멋진 코멘트2' })
				.set('Cookie', token);

			expect(err.status).toBe(401);
			expect(err.body.message).toEqual('댓글을 작성한 유저가 아닙니다.');
		});
	});

	describe('PATCH /post/comment/reply/:id', () => {
		it('정상적인 대댓글 업데이트', async () => {
			const token = await adminUserLogin();

			const commentReply = await commentReplyRepository().findOne({
				where: { text: '대댓글' },
			});

			const res = await server
				.patch(`/post/comment/reply/${commentReply!.id}`)
				.send({ text: '대댓글2' })
				.set('Cookie', token);

			expect(res.status).toBe(200);
		});

		it('익명 유저의 대댓글 업데이트', async () => {
			const commentReply = await commentReplyRepository().findOne({
				where: { text: '익명 대댓글' },
			});

			const res = await server
				.patch(`/post/comment/reply/${commentReply!.id}`)
				.send({ text: '익명 대댓글2', password: '1234' });

			expect(res.status).toBe(200);
		});

		it('익명 유저의 댓글 비밀번호가 틀려서 업데이트 실패', async () => {
			const commentReply = await commentReplyRepository().findOne({
				where: { text: '익명 대댓글2' },
			});

			const err = await server
				.patch(`/post/comment/reply/${commentReply!.id}`)
				.send({ text: '익명 대댓글 실패', password: '틀린 비밀번호' });

			expect(err.status).toBe(401);
			expect(err.body.message).toEqual('비밀번호가 틀립니다.');
		});

		it('댓글이 존재하지 않을때.', async () => {
			const err = await server
				.patch(`/post/comment/reply/${'asd'}`)
				.send({ text: '대댓글2' });

			expect(err.status).toBe(400);
			expect(err.body.message).toEqual('댓글이 존재하지 않습니다.');
		});

		it('댓글을 작성한 유저가 아닐 때.', async () => {
			const token = await userLogin();
			const commentReply = await commentReplyRepository().findOne({
				where: { text: '대댓글2' },
			});

			const err = await server
				.patch(`/post/comment/reply/${commentReply!.id}`)
				.send({ text: '대댓글2' })
				.set('Cookie', token);

			expect(err.status).toBe(401);
			expect(err.body.message).toEqual('댓글을 작성한 유저가 아닙니다.');
		});
	});

	describe('DELETE /post/comment/:id', () => {
		beforeEach(async () => {
			// * 삭제용 데이터입니다. 유저-익명
			const token = await adminUserLogin();
			const postId = await createPost();
			await server
				.post(`/post/comment/${postId}`)
				.send({ ...mockComment, text: '삭제용 코멘트' })
				.set('Cookie', token);
			await server
				.post(`/post/comment/${postId}`)
				.send({ ...mockComment, text: '삭제용 익명 코멘트', password: '1234' });

			const an = await commentRepository().findOne({
				where: { text: '삭제용 익명 코멘트' },
			});

			const comment = await commentRepository().findOne({
				where: { text: '삭제용 코멘트' },
			});

			await server
				.post(`/post/comment/reply/${comment!.id}`)
				.send({ ...mockComment, text: '삭제용 대댓글' })
				.set('Cookie', token);
			await server
				.post(`/post/comment/reply/${an!.id}`)
				.send({ ...mockComment, text: '삭제용 익명 대댓글', password: '1234' });
		});

		it('권한이 없는 유저 삭제 실패', async () => {
			const token = await userLogin();

			const comment = await commentRepository().findOne({
				where: { text: '삭제용 코멘트' },
			});

			const err = await server
				.delete(`/post/comment/${comment!.id}`)
				.set('Cookie', token);

			expect(err.status).toBe(401);
			expect(err.body.message).toEqual('댓글을 작성한 유저가 아닙니다.');
		});

		it('익명 댓글 비밀번호 틀려서 삭제 실패', async () => {
			const comment = await commentRepository().findOne({
				where: { text: '삭제용 코멘트' },
			});

			const err = await server
				.delete(`/post/comment/${comment!.id}`)
				.send({ password: '123' });

			expect(err.status).toBe(401);
			expect(err.body.message).toEqual('비밀번호가 틀립니다.');
		});

		it('정상적인 댓글 삭제', async () => {
			const token = await adminUserLogin();
			const comment = await commentRepository().findOne({
				where: { text: '삭제용 코멘트' },
			});

			const res = await server
				.delete(`/post/comment/${comment!.id}`)
				.set('Cookie', token);

			expect(res.status).toBe(200);
		});

		it('익명 댓글 삭제 성공', async () => {
			const comment = await commentRepository().findOne({
				where: { text: '삭제용 익명 코멘트' },
			});

			const res = await server
				.delete(`/post/comment/${comment!.id}`)
				.send({ password: '1234' });

			expect(res.status).toBe(200);
		});

		it('삭제 실패', async () => {
			const err = await server.delete('/post/comment/asd');

			expect(err.status).toBe(400);
			expect(err.body.message).toEqual('삭제 중 오류가 발생했습니다.');
		});
	});

	describe('DELETE /post/comment/reply/:id', () => {
		it('권한이 없는 유저 대댓글 삭제 실패', async () => {
			const token = await userLogin();

			const comment = await commentReplyRepository().findOne({
				where: { text: '삭제용 대댓글' },
			});

			const err = await server
				.delete(`/post/comment/reply/${comment!.id}`)
				.set('Cookie', token);

			expect(err.status).toBe(401);
			expect(err.body.message).toEqual('댓글을 작성한 유저가 아닙니다.');
		});

		it('익명 대댓글 비밀번호 틀려서 삭제 실패', async () => {
			const comment = await commentReplyRepository().findOne({
				where: { text: '삭제용 익명 대댓글' },
			});

			const err = await server
				.delete(`/post/comment/reply/${comment!.id}`)
				.send({ password: '124' });

			expect(err.status).toBe(401);
			expect(err.body.message).toEqual('비밀번호가 틀립니다.');
		});

		it('정상적인 유저가 대댓글 삭제', async () => {
			const token = await adminUserLogin();
			const comment = await commentReplyRepository().findOne({
				where: { text: '삭제용 대댓글' },
			});

			const res = await server
				.delete(`/post/comment/reply/${comment!.id}`)
				.set('Cookie', token);

			expect(res.status).toBe(200);
		});

		it('정상적인 익명의 대댓글 삭제', async () => {
			const comment = await commentReplyRepository().findOne({
				where: { text: '삭제용 익명 대댓글' },
			});

			const res = await server
				.delete(`/post/comment/reply/${comment!.id}`)
				.send({ password: '1234' });

			expect(res.status).toBe(200);
		});

		it('대댓글 삭제 실패', async () => {
			const err = await server.delete('/post/comment/reply/asd');

			expect(err.status).toBe(400);
			expect(err.body.message).toEqual('삭제 중 오류가 발생했습니다.');
		});
	});
});
