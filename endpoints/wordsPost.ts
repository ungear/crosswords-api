import { FastifyInstance } from "fastify";
import { addWord } from '../services/dataService';
import { AIService } from '../services/aiService';

const aiService = AIService.getInstance();

export async function wordsPost(server: FastifyInstance): Promise<any> {
  return server.post('/words', async (request: any, reply: any) => {
    const words = request.body.words;
    const questions = await aiService.getAnswerForWords(words);
    questions?.forEach((pair) => {
      addWord(pair[0], pair[1]);
    });
    return reply.send({ success: questions && questions.length > 0 });
  })
}