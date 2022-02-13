import { Connection, createConnection } from 'typeorm';
import config from './ormConfig';

const dbConnection = async (): Promise<Connection | null> => {
	const cnf = config.find((c) => c.name === process.env.NODE_ENV);

	try {
		await createConnection(cnf!)
			.then((connection) => {
				console.log(
					`DB connection success. \nDB: ${connection.options.database}\nNAME: ${connection.name}`
				);
			})
			.catch((err) => {
				console.log(err);
			});
	} catch (err) {
		console.log(err);
	}

	return null;
};

export default dbConnection;
