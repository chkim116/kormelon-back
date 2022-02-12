import request from 'supertest';

import { createTestServer } from '../features';

export const server: request.SuperTest<request.Test> = createTestServer();
