import express from 'express';

import {
	postCreateComment,
	postCreateReply,
	patchCreateComment,
	patchCreateReply,
	deleteComment,
	deleteReply,
} from '../controller/commentController';

export const commentRouter = express.Router();

/**
 * prefix.
 * /post/comment
 */

commentRouter.post('/:id', postCreateComment);
commentRouter.post('/reply/:id', postCreateReply);

commentRouter.patch('/:id', patchCreateComment);
commentRouter.patch('/reply/:id', patchCreateReply);

commentRouter.delete('/:id', deleteComment);
commentRouter.delete('/reply/:id', deleteReply);
