import Fastify from 'fastify';
import { authPlugin } from './plugins/auth.js';

import ticketRoutes from './modules/tickets/tickets.routes.js';
import syncRoutes from './modules/sync/sync.routes.js';
import merchantRoutes from './modules/merchant/merchant.routes.js';

export function buildApp() {
  const app = Fastify({ logger: true });

 app.register(authPlugin);

  app.register(ticketRoutes, { prefix: '/tickets' });
  app.register(syncRoutes, { prefix: '/sync' });
  app.register(merchantRoutes, { prefix: '/merchant' });

  app.get('/health', async () => ({ status: 'ok' }));

  return app;
}
