import { Response, Request } from 'express';
import { Like } from 'typeorm';

import logger from '../lib/logger';
import { tagRepository } from '../model/repository/TagRepository';

export const getTags = async (req: Request, res: Response) => {
	try {
		const tags = await tagRepository().find({ relations: ['posts'] });

		const results = tags
			.filter((tag) => tag.posts.length)
			.map((tag) => {
				return {
					id: tag.id,
					value: tag.value,
					count: tag.posts.length,
				};
			});

		res.status(200).send(results);
	} catch (err) {
		logger.error(err);
		res
			.status(400)
			.send({ message: '태그를 불러오는 중 오류가 발생했습니다.' });
	}
};

export const postTagsBySearch = async (req: Request, res: Response) => {
	const { value } = req.body;

	try {
		if (!value) {
			throw new Error('값이 없습니다.');
		}
		// 5개만
		const tags = await tagRepository().find({
			where: { value: Like(`%${value}%`) },
			order: {
				id: 'DESC',
			},
			relations: ['posts'],
			take: 5,
		});

		const results = tags
			.filter((tag) => tag.posts.length)
			.map((tag) => {
				return {
					id: tag.id,
					value: tag.value,
					count: tag.posts.length,
				};
			})
			.sort((a, b) => b.count - a.count);

		res.status(200).send(results);
	} catch (err) {
		logger.error(err);
		res
			.status(400)
			.send({ message: '태그를 불러오는 중 오류가 발생했습니다.' });
	}
};
