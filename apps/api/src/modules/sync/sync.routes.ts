import { FastifyInstance } from 'fastify';
import { syncTasks } from './sync.service.js';

export default async function (app: FastifyInstance) {
  app.post('/', syncTasks);
}
