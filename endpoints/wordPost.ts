import { FastifyInstance } from "fastify";
import { getWords } from '../services/dataService';

export async function wordPost(server: FastifyInstance): Promise<any> {
  return server.get('/words', async (request: any, reply: any) => {
    const words = await getWords();
    return reply.send({ words });
  })
}