import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { userRepository } from '../typeorm/repository/UserRepository';

export const isAuth = (req: Request, res: Response, next: NextFunction) => {
	const token = req.cookies.auth;

	if (!token) {
		return next();
	}

	// * jwt 확인
	jwt.verify(token, process.env.JWT!, async (err: any, decoded: any) => {
		if (err) {
			return res.status(500).send({ message: 'decode 실패' });
		}

		if (!decoded) {
			throw new Error();
		}

		const user = await userRepository().findOne({ id: decoded.userId });
		if (!user) {
			return next();
		}
		req.user = user;
		return next();
	});
};
