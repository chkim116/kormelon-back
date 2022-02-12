import request from 'supertest';
import { userRepository } from '../../typeorm/repository/UserRepository';
import { createTestServer } from '../features';

export const server: request.SuperTest<request.Test> = createTestServer();

export async function createUser() {
	await server
		.post('/user/register')
		.send({ email: 'chkim116@naver.com', password: '1' });
}

export async function getUserToken(isAdmin: boolean = false) {
	await createUser();
	const token = await server
		.post('/user/login')
		.send({ email: 'chkim116@naver.com', password: '1' })
		.then((res) => {
			return res.header['set-cookie'][0];
		});

	// Test용 권한 추가
	const user = await userRepository().findOne({ email: 'chkim116@naver.com' });
	await userRepository().save({ ...user!, isAdmin });

	return token;
}
