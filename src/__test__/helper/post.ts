import { server } from './server';
import { getUserToken } from './user';

/**
 *
 * 게시글 생성 후, id 리턴
 */
export async function getPostId() {
	const token = await getUserToken(true);
	const post = await server
		.post('/post')
		.send({
			title: '제목',
			content: '컨텐츠',
			parentCategory: '상위',
			category: 'default',
		})
		.set('Cookie', token);

	// text => post의 id값
	return post.text;
}
