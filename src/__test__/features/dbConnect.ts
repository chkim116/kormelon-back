import { getConnection } from 'typeorm';

import dbCreateConnection from '../../typeorm/dbCreateConnection';

export const dbConnect = async () => await dbCreateConnection();

export const dbClose = async () =>
	await getConnection(process.env.DB_DEV_NAME).close();
