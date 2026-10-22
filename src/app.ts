import fastify from 'fastify'
// /import crypto from 'node:crypto'
import cookie from '@fastify/cookie'
import { transactionsRoute } from './routes/transactions'

export const app = fastify({
  logger: true,
})

app.register(cookie)
app.register(transactionsRoute, {
  prefix: 'transactions',
})
