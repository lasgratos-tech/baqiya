import { FastifyInstance } from 'fastify';
import { getHistory } from './merchant.service.js';

export default async function (app: FastifyInstance) {
  app.get('/history', getHistory);
}
