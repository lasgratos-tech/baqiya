import { db } from './db';

export async function enqueueTask(task: any) {
  const d = await db;
  await d.put('pending_tasks', task);
}
