import express from 'express';

import { pingPong, postLogin } from '../controller/userController';

export const userRouter = express.Router();

userRouter.get('/ping', pingPong);
userRouter.post('/login', postLogin);
