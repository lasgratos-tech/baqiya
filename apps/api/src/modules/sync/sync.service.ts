import { FastifyRequest, FastifyReply } from 'fastify';
import { issueTicket, useTicket } from '../tickets/tickets.service.js';

export async function syncTasks(
  req: FastifyRequest,
  reply: FastifyReply
) {
  const { tasks } = req.body as any;

  for (const task of tasks) {
    if (task.type === 'CHANGE_ISSUE') {
      await issueTicket({ ...req, body: task.payload } as any, reply);
    }
    if (task.type === 'CHANGE_USE') {
      await useTicket({ ...req, body: task.payload } as any, reply);
    }
  }

  reply.send({ status: 'synced' });
}
