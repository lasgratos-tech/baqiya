import { FastifyRequest, FastifyReply } from 'fastify';
import { prisma } from '../../prisma.js';
import { generateShortCode } from '../../utils/shortCode.js';
import { expirationDate } from '../../utils/time.js';
import { recordLedgerTask } from '../../ledger/ledger.service.js';
import { TaskType, TicketStatus } from '@prisma/client';

export async function issueTicket(
  req: FastifyRequest,
  reply: FastifyReply
) {
  const { amount_snaps, offline_id } = req.body as any;

  const existing = await prisma.ledgerTask.findUnique({
    where: { offlineId: offline_id }
  });

  if (existing) {
    reply.send({ status: 'ok' });
    return;
  }

  const ticket = await prisma.ticket.create({
    data: {
      merchantId: req.merchantId,
      amountSnaps: amount_snaps,
      shortCode: generateShortCode(),
      qrPayload: offline_id,
      status: TicketStatus.ACTIVE,
      expiresAt: expirationDate(),
      offlineId: offline_id
    }
  });

  await recordLedgerTask({
    merchantId: req.merchantId,
    type: TaskType.CHANGE_ISSUE,
    ticketId: ticket.id,
    amountSnaps: amount_snaps,
    offlineId: offline_id
  });

  reply.send(ticket);
}

export async function useTicket(
  req: FastifyRequest,
  reply: FastifyReply
) {
  const { code, offline_id } = req.body as any;

  const existing = await prisma.ledgerTask.findUnique({
    where: { offlineId: offline_id }
  });

  if (existing) {
    reply.send({ status: 'ok' });
    return;
  }

  const ticket = await prisma.ticket.findUnique({
    where: { shortCode: code }
  });

  if (!ticket || ticket.status !== 'ACTIVE' || ticket.expiresAt < new Date()) {
    reply.status(400).send({ error: 'invalid_ticket' });
    return;
  }

  await prisma.ticket.update({
    where: { id: ticket.id },
    data: {
      status: TicketStatus.USED,
      usedAt: new Date()
    }
  });

  await recordLedgerTask({
    merchantId: req.merchantId,
    type: TaskType.CHANGE_USE,
    ticketId: ticket.id,
    amountSnaps: ticket.amountSnaps,
    offlineId: offline_id
  });

  reply.send({ status: 'used' });
}
