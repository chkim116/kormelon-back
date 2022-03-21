import { EntityRepository, getCustomRepository, Repository } from 'typeorm';
import { Views } from '../entities/Views';

export function viewRepository() {
	return getCustomRepository(ViewRepository, process.env.NODE_ENV);
}

@EntityRepository(Views)
export class ViewRepository extends Repository<Views> {
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
