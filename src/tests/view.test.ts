import { cronTotalView } from '../view';
import { server } from './helper/server';

describe('GET /view', () => {
	const getView = () => {
		return server.get('/view');
	};

	it('view', async () => {
		const res = await getView();

		expect(res.status).toBe(200);
		expect(res.body.today).toBe(1);
		expect(res.body.total).toBe(0);
	});

	it('같은 IP라면 view를 올리지 않음', async () => {
		await getView();
		await getView();
		await getView();
		const res = await getView();

		expect(res.status).toBe(200);
		expect(res.body.today).toBe(1);
		expect(res.body.total).toBe(0);
	});
});

describe('자정에 작동하는 total cron', () => {
	it('total 합계집', async () => {
		const total = await cronTotalView();

		expect(total.total).toBe(1);
		expect(total.today).toBe(0);
	});
});
