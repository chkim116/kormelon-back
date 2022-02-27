import { tagRepository } from '../model/repository/TagRepository';
import { server } from './helper/server';

describe('GET /tags', () => {
	it('모든 태그를 가져온다.', async () => {
		// 태그 생성
		await tagRepository().createTags(['태그']);

		const res = await server.get('/tags');

		expect(res.status).toBe(200);
		expect(res.body.length).toBeTruthy();
		expect(res.body[0].count).toBe(0);
	});
});

describe('POST /tags/search', () => {
	beforeAll(async () => {
		// 태그 생성
		await tagRepository().createTags([
			'자바스크립트',
			'자바스크립트2',
			'자바스크립트3',
			'자바스크립트4',
			'자바스크립트5',
			'자바스크립트6',
			'Ja',
			'주스',
			'짜스',
		]);
	});

	it('검색 값이 포함된 태그를 최대 5개까지만 가져온다.', async () => {
		const res = await server.post('/tags/search').send({ value: '자' });

		expect(res.status).toBe(200);
		expect(res.body).toHaveLength(5);
	});

	it('영어 태그의 경우 소/대문자를 가리지 않는다.', async () => {
		const res = await server.post('/tags/search').send({ value: 'j' });

		expect(res.status).toBe(200);
		expect(res.body).toHaveLength(1);
	});

	it('태그가 존재하지 않으면 빈 배열을 반환한다.', async () => {
		const res = await server.post('/tags/search').send({ value: '엥' });

		expect(res.status).toBe(200);
		expect(res.body).toHaveLength(0);
	});

	it('올바르지 않은 요청 시 오류 발생', async () => {
		const err = await server.post('/tags/search');

		expect(err.status).toBe(400);
		expect(err.body.message).toEqual('태그를 불러오는 중 오류가 발생했습니다.');
	});
});
