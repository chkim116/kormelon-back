import { Request, Response } from 'express';

import logger from '../lib/logger';
import {
	categoryRepository,
	parentCategoryRepository,
} from '../model/repository/CategoryRepository';

export const getCatogory = async (req: Request, res: Response) => {
	try {
		const categories = await parentCategoryRepository().find();

		res.status(200).send(categories);
	} catch (err) {
		logger.error(err);
		res.status(400).send({ message: '카테고리를 찾지 못했습니다.' });
	}
};

export const getSubCatogory = async (req: Request, res: Response) => {
	const { id } = req.params;
	try {
		const subCategories = await parentCategoryRepository()
			.findOne({
				where: { id },
			})
			.then((parent) => parent?.categories);

		res.status(200).send(subCategories);
	} catch (err) {
		logger.error(err);
		res.status(400).send({ message: '카테고리를 찾지 못했습니다.' });
	}
};

// * 상위 카테고리
export const postCreateParentCategory = async (req: Request, res: Response) => {
	const { value } = req.body;
	const user = req.user;

	try {
		if (!value) {
			return res.status(400).send({ message: '값을 입력해 주세요.' });
		}

		if (!user || !user.isAdmin) {
			return res.status(401).send({ message: '관리자만 생성 가능합니다.' });
		}

		await parentCategoryRepository().createParentCategory(value);

		res.sendStatus(201);
	} catch (err) {
		logger.error(err);
		res
			.status(400)
			.send({ message: '상위 카테고리 생성 중 오류가 발생했습니다.' });
	}
};

export const patchParentCategory = async (req: Request, res: Response) => {
	const { value } = req.body;
	const { id } = req.params;
	const user = req.user;

	try {
		if (!user || !user.isAdmin) {
			return res.status(401).send({ message: '관리자만 수정 가능합니다.' });
		}

		const parentCategory = await parentCategoryRepository().findOne({ id });

		if (!parentCategory) {
			throw new Error('존재하지 않는 상위 카테고리입니다.');
		}

		await parentCategoryRepository().updateParentCategory(
			parentCategory,
			value
		);

		res.sendStatus(200);
	} catch (err) {
		logger.error(err);
		res
			.status(400)
			.send({ message: '상위 카테고리 수정 중 오류가 발생했습니다.' });
	}
};

export const deleteParentCategory = async (req: Request, res: Response) => {
	const { id } = req.params;
	const user = req.user;

	try {
		if (!user || !user.isAdmin) {
			return res.status(401).send({ message: '관리자만 삭제 가능합니다.' });
		}

		const parentCategory = await parentCategoryRepository().findOne({
			where: { id },
		});

		if (!parentCategory) {
			throw new Error('존재하지 않는 상위 카테고리입니다.');
		}

		await parentCategoryRepository().deleteParentCategory(parentCategory);

		res.sendStatus(200);
	} catch (err) {
		logger.error(err);
		res
			.status(400)
			.send({ message: '상위 카테고리 삭제 중 오류가 발생했습니다.' });
	}
};

// * 하위 카테고리
export const postCreateCategory = async (req: Request, res: Response) => {
	const { value } = req.body;
	const { id } = req.params;
	const user = req.user;

	try {
		if (!value) {
			return res.status(400).send({ message: '값을 입력해 주세요.' });
		}

		if (!user || !user.isAdmin) {
			return res.status(401).send({ message: '관리자만 생성 가능합니다.' });
		}

		const parentCategory = await parentCategoryRepository().findOne({
			where: { id },
		});

		if (!parentCategory) {
			return res
				.status(400)
				.send({ message: '상위 카테고리가 존재하지 않습니다.' });
		}

		await categoryRepository().addCategory(parentCategory, value);

		res.sendStatus(201);
	} catch (err) {
		logger.error(err);
		res
			.status(400)
			.send({ message: '하위 카테고리 생성 중 오류가 발생했습니다.' });
	}
};

export const patchCategory = async (req: Request, res: Response) => {
	const { value } = req.body;
	const { id } = req.params;
	const user = req.user;

	try {
		if (!user || !user.isAdmin) {
			return res.status(401).send({ message: '관리자만 수정 가능합니다.' });
		}

		const category = await categoryRepository().findOne({ id });

		if (!category) {
			throw new Error('존재하지 않는 하위 카테고리입니다.');
		}

		await categoryRepository().updateCategory(category, value);
		res.sendStatus(200);
	} catch (err) {
		logger.error(err);
		res
			.status(400)
			.send({ message: '하위 카테고리 수정 중 오류가 발생했습니다.' });
	}
};

export const deleteCategory = async (req: Request, res: Response) => {
	const { id } = req.params;
	const user = req.user;

	try {
		if (!user || !user.isAdmin) {
			return res.status(401).send({ message: '관리자만 삭제 가능합니다.' });
		}

		const category = await categoryRepository().findOne({
			where: { id },
		});

		if (!category) {
			throw new Error('존재하지 않는 하위 카테고리입니다.');
		}

		await categoryRepository().deleteCategory(category);

		res.sendStatus(200);
	} catch (err) {
		logger.error(err);
		res
			.status(400)
			.send({ message: '하위 카테고리 삭제 중 오류가 발생했습니다.' });
	}
};
