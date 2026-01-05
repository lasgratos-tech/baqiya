import { db } from './db';
import { api } from '../api/client';

export async function sync() {
  if (!navigator.onLine) return;

  const d = await db;
  const tasks = await d.getAll('pending_tasks');
  if (!tasks.length) return;

  await api.post('/sync', { tasks });

  for (const t of tasks) {
    await d.delete('pending_tasks', t.offline_id);
  }
}
