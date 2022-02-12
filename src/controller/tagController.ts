import { Response, Request } from 'express';
import { tagRepository } from '../model/repository/TagRepository';

export const getTags = async (req: Request, res: Response) => {
	try {
		const tags = await tagRepository().find({ relations: ['posts'] });

		const results = tags.map((tag) => {
			return {
				id: tag.id,
				value: tag.value,
				count: tag.posts.length,
			};
		});

		res.status(200).send(results);
	} catch (err) {
		console.log(err);
		res
			.status(400)
			.send({ message: '태그를 불러오는 중 오류가 발생했습니다.' });
	}
};
