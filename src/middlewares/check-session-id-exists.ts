import { FastifyReply, FastifyRequest } from 'fastify'

async function checkSessionIdExists(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const sessionId = request.cookies.sessionId

  if (!sessionId) {
    console.log('erro')
    return reply.status(401).send({
      error: 'Unauthorized',
    })
  }
}

export default checkSessionIdExists
