import { tagRepository } from '../model/repository/TagRepository';
import { server } from './helper/server';

describe.only('GET /tags', () => {
	it('모든 태그를 가져온다.', async () => {
		// 태그 생성
		await tagRepository().createTags(['태그']);

		const res = await server.get('/tags');

		expect(res.status).toBe(200);
		expect(res.body.length).toBeTruthy();
		expect(res.body[0].count).toBe(0);
	});
});
