import { Request, Response } from 'express';
import { validationResult } from 'express-validator';
import { getCustomRepository } from 'typeorm';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

import { UserRepository } from '../typeorm/repository/UserRepository';
import { RegisterDTO } from './dto/userController.dto';

dotenv.config();

function userRepository() {
	return getCustomRepository(UserRepository, process.env.NODE_ENV);
}

function cookieOption() {
	return {
		maxAge: 60 * 60 * 1000 * 24 * 7,
	};
}

export const postRegister = async (req: Request, res: Response) => {
	const { email, password }: RegisterDTO = req.body;

	try {
		// valid
		const errors = validationResult(req);
		if (!errors.isEmpty()) {
			return res.status(400).send({ message: errors.array()[0].msg });
		}

		// user 확인
		const exists = await userRepository().findByEmail(email);
		if (exists) {
			return res.status(400).send({ message: '이미 존재하는 유저입니다.' });
		}

		// user 생성
		const salt = await bcrypt.genSalt(10);
		const hashPassword = await bcrypt.hash(password, salt);

		const userData = {
			username: email.split('@')[0],
			email,
			password: hashPassword,
		};

		const user = await userRepository().register(userData);
		await userRepository().save(user);
		res.sendStatus(201);
	} catch (err) {
		console.log(err);
		res.status(400).send({ message: '회원가입 중 에러가 발생했습니다.' });
	}
};

export const postLogin = async (req: Request, res: Response) => {
	const { email, password }: RegisterDTO = req.body;

	try {
		const user = await userRepository().findByEmail(email);

		if (!user) {
			throw new Error('존재하지 않는 유저입니다.');
		}

		// * password 체크
		const isPasswordCorrect = await bcrypt.compare(password, user.password);
		if (!isPasswordCorrect) {
			return res.status(401).send({ message: '비밀번호가 틀립니다.' });
		}

		// * token 생성
		const token = jwt.sign({ userId: user.id }, process.env.JWT!);
		res.status(200).cookie('auth', token, cookieOption()).send({
			id: user.id,
			email: user.email,
			username: user.username,
			isAdmin: user.is_admin,
		});
	} catch (err) {
		console.log(err);
		res.status(401).send({ message: '존재하지 않는 유저입니다.' });
	}

	res.status(200).send();
};

export const getAuth = async (req: Request, res: Response) => {
	const token = req.cookies.auth;

	if (!token) {
		return res.send(false);
	}

	try {
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
				return res
					.status(400)
					.send({ message: '해당 유저가 존재하지 않습니다.' });
			}

			res.status(200).send({
				id: user.id,
				email: user.email,
				username: user.username,
				isAdmin: user.is_admin,
			});
		});
	} catch (err) {
		console.log(err);
		res.sendStatus(401);
	}
};

export const postLogout = async (req: Request, res: Response) => {
	try {
		res.cookie('auth', '', { maxAge: 0 }).sendStatus(200);
	} catch (err) {
		console.log(err);
		res.sendStatus(400);
	}
};
