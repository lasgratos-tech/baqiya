import { FastifyPluginAsync } from 'fastify';

declare module 'fastify' {
  interface FastifyRequest {
    merchantId: string;
  }
}

export const authPlugin: FastifyPluginAsync = async (app) => {
  app.addHook('preHandler', async (req, reply) => {
    const merchantId = req.headers['x-merchant-id'];
    const token = req.headers['x-merchant-token'];

    if (!merchantId || token !== process.env.MERCHANT_TOKEN) {
      reply.status(401).send({ error: 'unauthorized' });
      return;
    }

    req.merchantId = String(merchantId);
  });
};
