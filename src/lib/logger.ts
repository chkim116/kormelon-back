import winston from 'winston';
import 'winston-daily-rotate-file';
import dayJs from 'dayjs';

const { combine, printf, colorize, simple, errors, timestamp, prettyPrint } =
	winston.format;

const format = printf(({ level, message }) => {
	const day = dayJs().format('YYYY-MM-DD-HH:mm');
	return `- ${day} ${level}: ${message}`;
});

const dirname = 'logs';

const logger = winston.createLogger({
	format: combine(
		format,
		timestamp(),
		errors({ stack: true }),
		colorize(),
		prettyPrint()
	),
	transports: [
		new winston.transports.DailyRotateFile({
			dirname,
			level: 'error',
			filename: '%DATE%.error.log',
			datePattern: 'YYYY-MM-DD',
			zippedArchive: true,
			maxFiles: 30,
		}),
		new winston.transports.DailyRotateFile({
			dirname,
			filename: '%DATE%.log',
			datePattern: 'YYYY-MM-DD',
			zippedArchive: true,
			maxFiles: 30,
		}),
	],
});

if (process.env.NODE_ENV !== 'production') {
	logger.add(
		new winston.transports.Console({
			format: combine(colorize(), simple()),
		})
	);
}

export default logger;
