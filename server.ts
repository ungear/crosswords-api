import Fastify, { FastifyInstance, RouteShorthandOptions } from 'fastify';
import { CrosswordService } from './services/crosswordService'
import { addWord, getRandomQuestions, getWords } from './services/dataService';
import { AIService } from './services/aiService';
import { getConfig } from './config';

const server: FastifyInstance = Fastify({
  logger: true // Enable built-in logger
});
const crosswordService = CrosswordService.getInstance();
const aiService = AIService.getInstance();

const opts: RouteShorthandOptions = {
  schema: {
    response: {
      200: {
        type: 'object',
        properties: {
          pong: {
            type: 'string'
          }
        }
      }
    }
  }
}

server.get('/ping', opts, async (request, reply) => {
  return { pong: 'it worked!' }
})

server.post('/word', async (request: any, reply: any) => {
  const word = request.body.word;
  const answer = request.body.answer;
  addWord(word, answer);
  return reply.send({ success: true });
})

server.get('/words', async (request: any, reply: any) => {
  const words = await getWords();
  return reply.send({ words });
})

server.post('/words', async (request: any, reply: any) => {
  const words = request.body.words;
  const questions = await aiService.getAnswerForWords(words);
  questions?.forEach((pair) => {
    addWord(pair[0], pair[1]);
  });
  return reply.send({ success: questions && questions.length > 0 });
})

server.get('/crossword', async (request, reply) => {
  const words = await getRandomQuestions(10);
  return crosswordService.generateCrossword(words);
})

const start = async () => {
  try {
    await server.listen({ port: getConfig().port })
  } catch (err) {
    server.log.error(err)
    process.exit(1)
  }
}

// Add this error handler
server.setErrorHandler((error, request, reply) => {
  server.log.error(error)
  reply.status(500).send({ error: 'Internal Server Error' })
})

start()