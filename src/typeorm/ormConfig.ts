import { ConnectionOptions } from 'typeorm';
import dotenv from 'dotenv';

dotenv.config();

const config: ConnectionOptions = {
	type: 'mysql',
	name: process.env.DB_DEV_NAME,
	host: process.env.DB_DEV_HOST,
	port: Number(process.env.DB_DEV_PORT),
	username: process.env.DB_DEV_USERNAME,
	password: process.env.DB_DEV_PASSWORD,
	database: process.env.DB_DEV_NAME,
	synchronize: true,
	logging: false,
	entities: [__dirname + '**/entities/*.{js,ts}'],
	migrations: ['./migrations/**/*.ts'],
	subscribers: ['./subscriber/**/*.ts'],
	cli: {
		entitiesDir: './entities',
		migrationsDir: './migrations',
		subscribersDir: './subscriber',
	},
};

export default config;
