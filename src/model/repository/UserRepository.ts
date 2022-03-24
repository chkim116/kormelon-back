import { EntityRepository, getCustomRepository, Repository } from 'typeorm';
import { User } from '../entities/User';

export function userRepository() {
	return getCustomRepository(UserRepository, process.env.NODE_ENV);
}

@EntityRepository(User)
export class UserRepository extends Repository<User> {
	findByEmail(email: string) {
		return this.findOne({
			where: { email },
			relations: ['posts', 'notifications'],
		});
	}

	register(user: Pick<User, 'username' | 'email' | 'password'>) {
		return this.save(user);
	}
}
