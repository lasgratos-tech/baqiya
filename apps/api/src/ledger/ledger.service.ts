import { prisma } from '../prisma.js';
import { TaskType } from '@prisma/client';

export async function recordLedgerTask(params: {
  merchantId: string;
  type: TaskType;
  ticketId?: string;
  amountSnaps: number;
  offlineId: string;
}) {
  return prisma.ledgerTask.create({
    data: params
  });
}
