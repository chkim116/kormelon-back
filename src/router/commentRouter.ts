import express from 'express';

import {
	postCreateComment,
	postCreateReply,
	patchCreateComment,
	patchCreateReply,
	deleteComment,
	deleteReply,
} from '../controller/commentController';
import { isAuth } from '../middleware/auth';

export const commentRouter = express.Router();

/**
 * prefix.
 * /post/comment
 */

commentRouter.post('/:id', isAuth, postCreateComment);
commentRouter.post('/reply/:id', isAuth, postCreateReply);

commentRouter.patch('/:id', isAuth, patchCreateComment);
commentRouter.patch('/reply/:id', isAuth, patchCreateReply);

commentRouter.delete('/:id', isAuth, deleteComment);
commentRouter.delete('/reply/:id', isAuth, deleteReply);
