import express from 'express';

import { getTags } from '../controller/tagController';

export const tagRouter = express.Router();

tagRouter.get('/', getTags);
