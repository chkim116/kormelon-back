import express from 'express';

import {
	postCreateCategory,
	patchParentCategory,
	postCreateParentCategory,
	patchCategory,
	deleteParentCategory,
	deleteCategory,
	getCatogory,
	getSubCatogory,
} from '../controller/categoryController';
import { isAuth } from '../middleware/auth';

/**
 * prefix
 * /category
 */
export const categoryRouter = express.Router();

categoryRouter.get('/', getCatogory);
categoryRouter.get('/:id', getSubCatogory);

categoryRouter.post('/', isAuth, postCreateParentCategory);
categoryRouter.post('/:id/sub', isAuth, postCreateCategory);

categoryRouter.patch('/:id', isAuth, patchParentCategory);
categoryRouter.patch('/:id/sub', isAuth, patchCategory);

categoryRouter.delete('/:id', isAuth, deleteParentCategory);
categoryRouter.delete('/:id/sub', isAuth, deleteCategory);
