import { EntityRepository, getCustomRepository, Repository } from 'typeorm';
import { View } from '../entities/view';

export function viewRepository() {
	return getCustomRepository(ViewRepository, process.env.NODE_ENV);
}

@EntityRepository(View)
export class ViewRepository extends Repository<View> {
	async getView() {
		const view = await this.findOne({ where: { id: 1 } });

		if (!view) {
			const newView = await this.save({ id: 1, today: 0, total: 0, ips: [] });

			return newView;
		}

		return view;
	}

	async total() {
		const view = await this.findOne({ where: { id: 1 } });

		if (!view) {
			throw new Error('view is not defined');
		}

		return await this.save({
			id: 1,
			total: view.total + view?.today,
			today: 0,
			ips: [],
		});
	}
}
