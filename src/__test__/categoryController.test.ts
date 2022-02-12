import {
	categoryRepository,
	parentCategoryRepository,
} from '../typeorm/repository/CategoryRepository';
import { dbClear, dbClose, dbConnect } from './features';
import { getUserToken, server } from './helper/user';

beforeAll(async () => {
	await dbConnect();
	await dbClear();
});

afterAll(async () => {
	await dbClose();
});

const parentValue = '상위 카테고리';
const parentUpdate = '상위 카테고리2';
const subValue = '하위 카테고리';
const subUpdate = '하위 카테고리2';

describe('Category test', () => {
	const getParentId = (value: string = parentValue) =>
		parentCategoryRepository()
			.findOne({
				value,
			})
			.then((res) => res!.id);

	const getSubId = (value: string = subValue) =>
		categoryRepository()
			.findOne({ value })
			.then((res) => res!.id);

	describe('POST /category', () => {
		it('정상적인 상위 카테고리 생성', async () => {
			const token = await getUserToken(true);
			const res = await server
				.post('/category')
				.send({ value: parentValue })
				.set('Cookie', token);

			expect(res.status).toBe(201);
		});

		it('값을 입력하지 않고 보냈을 때', async () => {
			const token = await getUserToken(true);

			const err = await server
				.post('/category')
				.send({ value: '' })
				.set('Cookie', token);

			expect(err.status).toBe(400);
			expect(err.body.message).toEqual('값을 입력해 주세요.');
		});

		it('권한이 없는 유저는 상위 카테고리 생성 실패', async () => {
			const token = await getUserToken();
			const err = await server
				.post('/category')
				.send({ value: parentValue })
				.set('Cookie', token);

			expect(err.status).toBe(401);
			expect(err.body.message).toEqual('관리자만 생성 가능합니다.');
		});
	});

	describe('POST /category/:id/sub', () => {
		it('정상적인 하위 카테고리 생성', async () => {
			const token = await getUserToken(true);
			const parentId = await getParentId();

			const res = await server
				.post(`/category/${parentId}/sub`)
				.send({ value: subValue })
				.set('Cookie', token);

			expect(res.status).toBe(201);
		});

		it('값을 입력하지 않고 보냈을 때', async () => {
			const token = await getUserToken(true);
			const parentId = await getParentId();

			const err = await server
				.post(`/category/${parentId}/sub`)
				.send({ value: '' })
				.set('Cookie', token);

			expect(err.status).toBe(400);
			expect(err.body.message).toEqual('값을 입력해 주세요.');
		});

		it('권한이 없는 유저는 하위 카테고리 생성 실패', async () => {
			const token = await getUserToken();
			const subId = getSubId();

			const err = await server
				.post(`/category/${subId}/sub`)
				.send({ value: subValue })
				.set('Cookie', token);

			expect(err.status).toBe(401);
			expect(err.body.message).toEqual('관리자만 생성 가능합니다.');
		});
	});

	describe('PATCH /category/:id', () => {
		it('정상적인 상위 카테고리 업데이트', async () => {
			const token = await getUserToken(true);
			const parentId = await getParentId();

			const res = await server
				.patch(`/category/${parentId}`)
				.send({ value: parentUpdate })
				.set('Cookie', token);

			expect(res.status).toBe(200);
		});

		it('권한이 없는 유저는 상위 카테고리 업데이트 실패', async () => {
			const parentId = await getParentId(parentUpdate);

			const err = await server
				.patch(`/category/${parentId}`)
				.send({ value: parentUpdate });

			expect(err.status).toBe(401);
			expect(err.body.message).toEqual('관리자만 수정 가능합니다.');
		});

		it('잘못된 경로로 상위 카테고리 업데이트 실패', async () => {
			const token = await getUserToken(true);

			const err = await server
				.patch(`/category/${'asd'}`)
				.send({ value: parentUpdate })
				.set('Cookie', token);

			expect(err.status).toBe(400);
			expect(err.body.message).toEqual(
				'상위 카테고리 수정 중 오류가 발생했습니다.'
			);
		});
	});

	describe('PATCH /category/:id/sub', () => {
		it('정상적인 하위 카테고리 업데이트', async () => {
			const token = await getUserToken(true);
			const subId = await getSubId();

			const res = await server
				.patch(`/category/${subId}/sub`)
				.send({ value: subUpdate })
				.set('Cookie', token);

			expect(res.status).toBe(200);
		});

		it('권한이 없는 유저는 하위 카테고리 업데이트 실패', async () => {
			const subId = await getSubId(subUpdate);

			const err = await server
				.patch(`/category/${subId}/sub`)
				.send({ value: subUpdate });

			expect(err.status).toBe(401);
			expect(err.body.message).toEqual('관리자만 수정 가능합니다.');
		});

		it('잘못된 경로로 하위 카테고리 업데이트 실패', async () => {
			const token = await getUserToken(true);

			const err = await server
				.patch(`/category/${'asd'}/sub`)
				.send({ value: subUpdate })
				.set('Cookie', token);

			expect(err.status).toBe(400);
			expect(err.body.message).toEqual(
				'하위 카테고리 수정 중 오류가 발생했습니다.'
			);
		});
	});

	describe('DELETE /category/:id/sub', () => {
		it('권한이 없는 유저는 하위 카테고리 삭제 실패', async () => {
			const subId = await getSubId(subUpdate);

			const err = await server.delete(`/category/${subId}`);

			expect(err.status).toBe(401);
			expect(err.body.message).toEqual('관리자만 삭제 가능합니다.');
		});

		it('정상적인 하위 카테고리 삭제', async () => {
			const token = await getUserToken(true);

			const subId = await getSubId(subUpdate);

			const res = await server
				.delete(`/category/${subId}/sub`)
				.set('Cookie', token);

			expect(res.status).toBe(200);
		});

		it('잘못된 경로로 하위 카테고리 삭제 실패', async () => {
			const token = await getUserToken(true);

			const err = await server
				.delete(`/category/${'asd'}/sub`)
				.set('Cookie', token);

			expect(err.status).toBe(400);
			expect(err.body.message).toEqual(
				'하위 카테고리 삭제 중 오류가 발생했습니다.'
			);
		});
	});

	describe('DELETE /category/:id', () => {
		it('권한이 없는 유저는 상위 카테고리 삭제 실패', async () => {
			const parentId = await getParentId(parentUpdate);
			const err = await server.delete(`/category/${parentId}`);
			expect(err.status).toBe(401);
			expect(err.body.message).toEqual('관리자만 삭제 가능합니다.');
		});

		it('정상적인 상위 카테고리 삭제', async () => {
			const token = await getUserToken(true);

			const parentId = await getParentId(parentUpdate);

			const res = await server
				.delete(`/category/${parentId}`)
				.set('Cookie', token);
			expect(res.status).toBe(200);
		});

		it('잘못된 경로로 상위 카테고리 삭제 실패', async () => {
			const token = await getUserToken(true);

			const err = await server
				.delete(`/category/${'asd'}`)
				.set('Cookie', token);

			expect(err.status).toBe(400);
			expect(err.body.message).toEqual(
				'상위 카테고리 삭제 중 오류가 발생했습니다.'
			);
		});
	});
});
