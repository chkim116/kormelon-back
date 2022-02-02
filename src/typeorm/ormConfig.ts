import { ConnectionOptions } from 'typeorm';
import dotenv from 'dotenv';

dotenv.config();

const config: ConnectionOptions = {
	type: 'mysql',
	host: process.env.DB_DEV_HOST,
	port: Number(process.env.DB_DEV_PORT),
	username: process.env.DB_DEV_USERNAME,
	password: process.env.DB_DEV_PASSWORD,
	database: process.env.DB_DEV_NAME,
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
