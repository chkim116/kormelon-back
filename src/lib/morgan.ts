import morgan from 'morgan';

import logger from './logger';

const isProd = process.env.NODE_ENV === 'production';

const format = isProd
	? 'HTTP/:http-version :method :remote-addr :url :remote-user :status :res[content-length] :referrer :user-agent :response-time ms'
	: 'dev';

const stream = {
	write: (message: string) => logger.info(message),
};

// production일때만 morgan log를 남깁니다.
export default isProd ? morgan(format, { stream }) : morgan(format);
