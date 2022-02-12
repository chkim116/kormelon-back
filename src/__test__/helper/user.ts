import { userRepository } from '../../typeorm/repository/UserRepository';
import { server } from './server';

// 관리자용으로 사용할 아이디 생성
export async function createAdminUser() {
	await server
		.post('/user/register')
		.send({ email: 'chkim116@naver.com', password: '1' });
}

// 일반 유저로 사용할 아이디 생성
export async function createUser() {
	await server
		.post('/user/register')
		.send({ email: 'c@naver.com', password: '1' });
}

/**
 *
 * 유저의 토큰을 얻어옵니다. `true`면 관리자를 얻습니다.
 * @param boolean - 관리자 여부
 * @returns token
 */
export async function getUserToken(isAdmin: boolean = false) {
	const mockUser = {
		email: isAdmin ? 'chkim116@naver.com' : 'c@naver.com',
		password: '1',
	};

	const token = await server
		.post('/user/login')
		.send(mockUser)
		.then((res) => {
			return res.header['set-cookie'][0];
		});

	// Test용 권한 추가
	const user = await userRepository().findOne({ email: 'chkim116@naver.com' });
	await userRepository().save({ ...user!, isAdmin });

	return token;
}
