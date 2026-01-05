import { FastifyInstance } from 'fastify';
import { issueTicket, useTicket } from './tickets.service.js';

export default async function (app: FastifyInstance) {
  app.post('/issue', issueTicket);
  app.post('/use', useTicket);
}
