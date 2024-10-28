import { FastifyInstance } from "fastify";
import { addWord } from '../services/dataService';

export async function wordsGet(server: FastifyInstance): Promise<any> {
  return server.post('/word', async (request: any, reply: any) => {
    const word = request.body.word;
    const answer = request.body.answer;
    addWord(word, answer);
    return reply.send({ success: true });
  })
}