import { EntityRepository, getCustomRepository, Repository } from 'typeorm';
import { Tag } from '../entities/Tag';

export function tagRepository() {
	return getCustomRepository(TagRepository, process.env.NODE_ENV);
}

@EntityRepository(Tag)
export class TagRepository extends Repository<Tag> {
	async checkExist(value: string) {
		const exist = await this.findOne({ value });
		return exist;
	}

	async createTag(value: string) {
		const tag = this.create({ value });
		const result = await this.save(tag);

		return result;
	}
}
