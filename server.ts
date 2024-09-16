import Fastify, { FastifyInstance, RouteShorthandOptions } from 'fastify'
import { CrosswordService } from './services/crosswordService'
import { addWord, getWords } from './services/dataService';

const server: FastifyInstance = Fastify({})
const crosswordService = CrosswordService.getInstance()

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

server.get('/crossword', async (request, reply) => {
  return crosswordService.generateCrossword(["banana", "apple", "spire"]);
})

const start = async () => {
  try {
    await server.listen({ port: 3000 })

    const address = server.server.address()
    const port = typeof address === 'string' ? address : address?.port

  } catch (err) {
    server.log.error(err)
    process.exit(1)
  }
}

start()