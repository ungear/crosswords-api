import { FastifyInstance, RouteShorthandOptions } from "fastify";

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

export async function pingGet(server: FastifyInstance): Promise<any> {
  return server.get('/ping', opts, async (request, reply) => {
    return { pong: 'it works!' }
  })
}