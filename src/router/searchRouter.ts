import { Router } from 'express';
import {
	getSearchByTag,
	getSearchByCategory,
	getSearchBySubCategory,
} from '../controller/searchController';

export const searchRouter = Router();

/**
 * prefix
 * /search
 */
searchRouter.get('/tag', getSearchByTag);
searchRouter.get('/category', getSearchByCategory);
searchRouter.get('/sub', getSearchBySubCategory);
