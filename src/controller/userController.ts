import { Request, Response } from 'express';

export const pingPong = (req: Request, res: Response) => {
	res.status(200).send('pong');
};

export const postLogin = (req: Request, res: Response) => {
	const { body } = req;
	res.status(200).send(body);
};
