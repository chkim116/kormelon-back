import { Router } from 'express';
import {
	getSearchByTag,
	getSearchByCategory,
	getSearchBySubCategory,
	getSearchByText,
} from '../controller/searchController';

export const searchRouter = Router();

/**
 * prefix
 * /search
 */
searchRouter.get('/', getSearchByText);
searchRouter.get('/tag', getSearchByTag);
searchRouter.get('/category', getSearchByCategory);
searchRouter.get('/sub', getSearchBySubCategory);
