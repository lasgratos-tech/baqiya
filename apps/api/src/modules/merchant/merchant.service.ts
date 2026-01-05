import { FastifyRequest, FastifyReply } from 'fastify';
import { prisma } from '../../prisma.js';

export async function getHistory(
  req: FastifyRequest,
  reply: FastifyReply
) {
  const tickets = await prisma.ticket.findMany({
    where: { merchantId: req.merchantId },
    orderBy: { issuedAt: 'desc' },
    take: 50
  });

  reply.send(tickets);
}
