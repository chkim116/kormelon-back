import { User } from '../typeorm/entities/User';

declare global {
	namespace Express {
		interface Request {
			user?: User;
		}
	}
}
