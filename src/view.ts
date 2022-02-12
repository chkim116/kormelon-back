// view.test.ts
import { Request, Response } from 'express';
import requestIp from 'request-ip';

import { viewRepository } from './model/repository/ViewRepository';

export const checkView = async (req: Request, res: Response) => {
	const me = req.user?.isAdmin;
	try {
		const { today, total, ips } = await viewRepository().getView();
		const clientIp = requestIp.getClientIp(req);

		// 관리자이거나, ip가 없으면 리턴
		if (me || !clientIp) {
			return res.status(200).send({
				today: today,
				total: total,
			});
		}

		// ip가 포함되어 있다면 기존 view 리턴
		if (ips.includes(clientIp)) {
			return res.status(200).send({
				today,
				total,
			});
		}

		// view + 1
		const newView = await viewRepository().save({
			id: 1,
			today: today + 1,
			total,
			ips: [...ips, clientIp],
		});
		res.status(200).send({
			today: newView.today,
			total: newView.total,
		});
	} catch (err) {
		console.log(err);
		res.sendStatus(400);
	}
};

export const cronTotalView = async () => {
	return await viewRepository().total();
};
