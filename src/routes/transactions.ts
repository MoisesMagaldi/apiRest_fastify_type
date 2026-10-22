import { FastifyInstance } from 'fastify'
import { knex } from '../database'
import { z } from 'zod'
import crypto, { randomUUID } from 'node:crypto'
import check from '../middlewares/check-session-id-exists'

export async function transactionsRoute(app: FastifyInstance) {
  app.get(
    '/',
    {
      preHandler: [check],
    },
    async (request) => {
      const sessionId = request.cookies.sessionId
      const transactions = await knex('transactions')
        .where('session_id', sessionId)
        .select()
      return {
        transactions,
      }
    },
  )

  app.get(
    '/summary',
    {
      preHandler: [check],
    },
    async (request) => {
      const sessionId = request.cookies.sessionId
      const summary = await knex('transactions')
        .where('session_id', sessionId)
        .sum('amount', { as: 'amount' })
        .first()

      return summary
    },
  )

  app.get(
    '/:id',
    {
      preHandler: [check],
    },
    async (request) => {
      const getTransactionsParamsSchema = z.object({
        id: z.string().uuid(),
      })
      const { id } = getTransactionsParamsSchema.parse(request.params)
      const sessionId = request.cookies.sessionId

      const transactions = await knex('transactions')
        .where({
          id,
          session_id: sessionId,
        })
        .first()

      return {
        transactions,
      }
    },
  )

  app.post('/', async (req, reply) => {
    console.log('ola')
    const createTransactionBodyShema = z.object({
      title: z.string(),
      amount: z.number(),
      type: z.enum(['credit', 'debit']),
    })
    const { title, amount, type } = createTransactionBodyShema.parse(req.body) // body

    let sessionId = req.cookies.sessionId

    if (!sessionId) {
      // cria o cookie caso nao exista
      sessionId = randomUUID()

      reply.cookie('sessionId', sessionId, {
        path: '/',
        maxAge: 60 * 60 * 24 * 7, // 7 days
      })
    }

    await knex('transactions').insert({
      id: crypto.randomUUID(),
      title,
      amount: type === 'credit' ? amount : amount * -1,
      type,
      session_id: sessionId,
    })
    return reply.status(201).send()
  })
}
