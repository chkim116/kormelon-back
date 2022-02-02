import { Connection, createConnection } from 'typeorm';

import config from './ormConfig';

const dbCreateConnection = async (): Promise<Connection | null> => {
	try {
		await createConnection(config)
			.then((connection) => {
				console.log(
					`DB connection success. \nDB: ${connection.options.database}`
				);
			})
			.catch((err) => {
				throw new Error(err);
			});
	} catch (err) {
		console.log(err);
	}

	return null;
};

export default dbCreateConnection;
