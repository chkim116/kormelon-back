import { Request, Response } from 'express';
import { validationResult } from 'express-validator';
import { getCustomRepository } from 'typeorm';
import bcrypt from 'bcrypt';

import { UserRepository } from '../typeorm/repository/UserRepository';
import { RegisterDTO } from './dto/userController.dto';

export const postRegister = async (req: Request, res: Response) => {
	const userRepository = getCustomRepository(
		UserRepository,
		process.env.NODE_ENV
	);
	const { email, password }: RegisterDTO = req.body;

	try {
		// valid
		const errors = validationResult(req);
		if (!errors.isEmpty()) {
			return res.status(400).send({ message: errors.array()[0].msg });
		}

		// user 확인
		const exists = await userRepository.findByEmail(email);
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

		const user = await userRepository.register(userData);
		await userRepository.save(user);
		res.sendStatus(201);
	} catch (err) {
		console.log(err);
		res.status(400).send({ message: '회원가입 중 에러가 발생했습니다.' });
	}
};

export const postLogin = (req: Request, res: Response) => {
	const { body } = req;
	res.status(200).send(body);
};
