import { ConnectionOptions } from 'typeorm';
import dotenv from 'dotenv';

dotenv.config();

const defaultConfig = {
	logging: false,
	entities: ['./model/entities/*.{js,ts}'],
	migrations: ['./model/migration/*.ts'],
	cli: {
		entitiesDir: 'src/model/entity',
		migrationsDir: 'src/model/migration',
	},
};

const connections: ConnectionOptions[] = [
	{
		type: 'mysql',
		name: 'production',
		host: process.env.DB_PROD_HOST,
		port: Number(process.env.DB_PROD_PORT),
		username: process.env.DB_PROD_USERNAME,
		password: process.env.DB_PROD_PASSWORD,
		database: process.env.DB_PROD_NAME,
		// 최초 한번만 실행
		synchronize: true,
		...defaultConfig,
	},
	{
		type: 'mysql',
		name: 'development',
		host: process.env.DB_DEV_HOST,
		port: Number(process.env.DB_DEV_PORT),
		username: process.env.DB_DEV_USERNAME,
		password: process.env.DB_DEV_PASSWORD,
		database: process.env.DB_DEV_NAME,
		synchronize: true,
		...defaultConfig,
	},
	{
		type: 'mysql',
		name: 'test',
		host: process.env.DB_TEST_HOST,
		port: Number(process.env.DB_TEST_PORT),
		username: process.env.DB_TEST_USERNAME,
		password: process.env.DB_TEST_PASSWORD,
		database: process.env.DB_TEST_NAME,
		synchronize: true,
		...defaultConfig,
	},
];

export default connections;
