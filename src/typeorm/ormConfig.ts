import { ConnectionOptions } from 'typeorm';

const config: ConnectionOptions = {
	type: 'mariadb',
	host: process.env.DB_HOST,
	port: Number(process.env.DB_PORT),
	username: process.env.DB_USERNAME,
	password: process.env.DB_PASSWORD,
	database: process.env.DB_NAME,
	synchronize: false,
	logging: false,
	entities: ['./entities/**/*.ts'],
	migrations: ['./migrations/**/*.ts'],
	subscribers: ['./subscriber/**/*.ts'],
	cli: {
		entitiesDir: './entities',
		migrationsDir: './migrations',
		subscribersDir: './subscriber',
	},
};

export default config;
