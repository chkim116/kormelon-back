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
		return await this.save(tag);
	}

	async createTags(values: string[]) {
		const tags: Tag[] = [];

		const map = [...new Set(values)].map(async (value: string) => {
			const exist = await tagRepository().checkExist(value);
			if (exist) {
				return exist;
			}
			return await tagRepository().createTag(value);
		});
		await Promise.all(map).then((res) => {
			res.forEach((tag) => {
				tag && tags.push(tag);
			});
		});

		return tags;
	}
}
