import { User } from '../model/entities/User';

declare global {
	namespace Express {
		interface Request {
			user?: User;
		}
	}
}
