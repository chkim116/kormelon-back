import express from 'express';

import {
	postCreateComment,
	postCreateReply,
} from '../controller/commentController';

export const commentRouter = express.Router();

/**
 * prefix.
 * /post/comment
 */

commentRouter.post('/:title', postCreateComment);
commentRouter.post('/reply/:id', postCreateReply);
