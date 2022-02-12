import { createCategory } from './src/__test__/helper/category';
import { dbConnect, dbClear, dbClose } from './src/__test__/helper/db';
import { createAdminUser, createUser } from './src/__test__/helper/user';

console.log("I'll be called first before any test cases run");

beforeAll(async () => {
	await dbConnect();
	await dbClear();

	// === getUserToken을 위함 === //
	// 관리자용 유저 생성
	await createAdminUser();
	// 일반 유저 생성
	await createUser();

	// === 상위 카테고리 생성, 기본으로 하위 카테고리에는 default가 들어있음 === //
	await createCategory();
});

afterAll(async () => {
	await dbClose();
});
