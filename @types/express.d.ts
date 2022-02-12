import { User } from '../src/model/entities/User';

declare global {
	namespace Express {
		interface Request {
			user?: User;
		}
	}
}
