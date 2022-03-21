import { Request, Response } from 'express';
import logger from '../lib/logger';
import { postRepository } from '../model/repository/PostRepository';

type SearchQuery = Record<'q' | 'per' | 'page', string>;

export const getSearchByText = async (req: Request, res: Response) => {
	const { q: text, per, page } = req.query as SearchQuery;

	try {
		if (!text)
			return res.status(400).send({ message: '검색 쿼리가 없습니다.' });

		const results = await postRepository().findPostsByText(
			text as string,
			Number(page) || 1,
			Number(per) || 10
		);

		res.status(200).send(results);
	} catch (err) {
		res.status(400).send({ message: '검색 결과 조회 중 오류가 발생했습니다.' });
	}
};

export const getSearchByCategory = async (req: Request, res: Response) => {
	const { q: categoryValue, per, page } = req.query as SearchQuery;

	try {
		if (!categoryValue)
			return res
				.status(400)
				.send({ message: '상위 카테고리 쿼리가 없습니다.' });

		const results = await postRepository().findPostsByCategory(
			categoryValue as string,
			Number(page) || 1,
			Number(per) || 10
		);

		res.status(200).send(results);
	} catch (err) {
		res.status(400).send({ message: '검색 결과 조회 중 오류가 발생했습니다.' });
	}
};

export const getSearchBySubCategory = async (req: Request, res: Response) => {
	const { q: subCategoryValue, per, page } = req.query as SearchQuery;

	try {
		if (!subCategoryValue)
			return res
				.status(400)
				.send({ message: '하위 카테고리 쿼리가 없습니다.' });

		const results = await postRepository().findPostsBySubCategory(
			subCategoryValue as string,
			Number(page) || 1,
			Number(per) || 10
		);

		res.status(200).send(results);
	} catch (err) {
		res.status(400).send({ message: '검색 결과 조회 중 오류가 발생했습니다.' });
	}
};

export const getSearchByTag = async (req: Request, res: Response) => {
	const { q: tagValue, page, per } = req.query as SearchQuery;
	try {
		if (!tagValue)
			return res.status(400).send({ message: '태그 검색 쿼리가 없습니다.' });

		const results = await postRepository().findPostsByTag(
			tagValue as string,
			Number(page) || 1,
			Number(per) || 10
		);

		res.status(200).send(results);
	} catch (err) {
		logger.error(err);
		res.status(400).send({ message: '검색 결과 조회 중 오류가 발생했습니다.' });
	}
};
