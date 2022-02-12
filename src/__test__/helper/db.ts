import { Connection, getConnection } from 'typeorm';

import dbCreateConnection from '../../model/dbCreateConnection';

export const dbConnect = async () => await dbCreateConnection();

export const dbClose = async () =>
	await getConnection(process.env.NODE_ENV).close();

export const dbClear = async () => {
	const db = await getConnection(process.env.NODE_ENV);
	const entities = db.entityMetadatas;

	await Promise.all(
		entities.map(
			async (entity) => await deleteAll(entity.name, entity.tableName, db)
		)
	);

	async function deleteAll(
		entityName: string,
		entityTableName: string,
		connection: Connection
	) {
		const repository = connection.getRepository(entityName);
		await repository.query(`SET foreign_key_checks = 0;`);
		await repository.query(`DELETE FROM ${entityTableName}`);
	}
};
