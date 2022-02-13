import { server } from './server';
import { getUserToken } from './user';

/**
 * 상위 카테고리 생성
 * 기본으로 하위에 default 카테고리가 생성된다.
 */
export const createCategory = async (value: string = '상위') => {
	const token = await getUserToken(true);
	return server.post('/category').send({ value }).set('Cookie', token);
};
