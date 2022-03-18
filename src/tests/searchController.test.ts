import { server } from './helper/server';
import { getUserToken } from './helper/user';

const CATEGORY_VALUE = '상위';
const SUB_CATEGORY_VALUE = 'default';
const TAG_VALUE = '태그1';

const PER = 10;
const PAGE = 1;

const mockPost = {
	title: '제목',
	content: '컨텐츠',
	tags: [TAG_VALUE],
	parentCategory: CATEGORY_VALUE,
	category: SUB_CATEGORY_VALUE,
};

beforeAll(async () => {
	// 3개의 게시글을 임의로 생성합니다.
	const token = await getUserToken(true);

	await createPost(1);
	await createPost(2);
	await createPost(3);

	function createPost(i: number) {
		return server
			.post('/post')
			.send({ ...mockPost, title: mockPost.title + i })
			.set('Cookie', token);
	}
});

describe('GET /search/tag?q={query}', () => {
	it('태그에 따른 게시글을 가져온다.', async () => {
		const res = await server.get(
			`/search/tag?q=${encodeURIComponent(TAG_VALUE)}&page=${PAGE}&per=${PER}`
		);
		expect(res.status).toBe(200);
		expect(res.body.total).toBe(3);
		expect(res.body.results.length).toBe(3);
	});

	it('태그 쿼리를 날리지 않으면 에러를 반환한다.', async () => {
		const res = await server.get(`/search/tag?page=${PAGE}&per=${PER}`);

		expect(res.status).toBe(400);
		expect(res.body.message).toBe('태그 검색 쿼리가 없습니다.');
	});
});
