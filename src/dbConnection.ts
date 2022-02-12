import { Connection, createConnection } from 'typeorm';

const dbConnection = async (): Promise<Connection | null> => {
	try {
		await createConnection(process.env.NODE_ENV!)
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
