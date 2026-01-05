import { prisma } from '../prisma.js';

export async function recordLedgerTask(params: {
  merchantId: string;
  type: 'CHANGE_ISSUE' | 'CHANGE_USE';
  ticketId?: string;
  amountSnaps: number;
  offlineId: string;
}) {
  return prisma.ledgerTask.create({
    data: params
  });
}
