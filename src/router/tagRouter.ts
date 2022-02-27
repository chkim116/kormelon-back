import express from 'express';

import { getTags, postTagsBySearch } from '../controller/tagController';

export const tagRouter = express.Router();

/**
 * prefix
 * /tags
 */
tagRouter.get('/', getTags);

tagRouter.post('/search', postTagsBySearch);
