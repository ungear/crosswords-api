import Fastify, { FastifyInstance } from 'fastify';
import { getConfig } from './config';
import { crosswordGet } from './endpoints/crosswordGet';
import { pingGet } from './endpoints/pingGet';
import { wordPost } from './endpoints/wordPost';
import { wordsGet } from './endpoints/wordsGet';
import { wordsPost } from './endpoints/wordsPost';

const server: FastifyInstance = Fastify({
  logger: true // Enable built-in logger
});

server.register(require('@fastify/swagger'), {
  swagger: {
    info: {
      title: 'Crosswords API',
      description: 'Crosswords API',
      version: 'alpha',
      consumes: ['application/json'],
      produces: ['application/json']
    }
  }
})

server.register(require('@fastify/swagger-ui'), {
  routePrefix: '/documentation',
  uiConfig: {
    docExpansion: 'full',
    deepLinking: false
  },
  uiHooks: {
    onRequest: function (request: any, reply: any, next: any) { next() },
    preHandler: function (request: any, reply: any, next: any) { next() }
  },
  staticCSP: true,
  transformStaticCSP: (header: any) => header,
  transformSpecification: (swaggerObject: any , request: any, reply: any) => { return swaggerObject },
  transformSpecificationClone: true
})

// register HTTP handlers
server.register(async function(server){
  server.register(pingGet);
  server.register(wordPost);
  server.register(wordsGet);
  server.register(wordsPost);
  server.register(crosswordGet);
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