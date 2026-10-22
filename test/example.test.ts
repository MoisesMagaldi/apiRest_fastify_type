import { expect, test, beforeAll,afterAll, describe, beforeEach} from 'vitest'
import request from 'supertest'
import { app } from '../src/app'
import { execSync } from 'node:child_process'
import { title } from 'node:process'
import { create } from 'node:domain'

describe("Transactions routes",()=>{
  beforeAll(async()=>{
  await app.ready()
})

afterAll(async()=>{
  await app.close()
})

beforeEach(() =>{
  execSync('npm run knex migrate:rollback --all')
  execSync('npm run knex migrate:latest')
})

test('o usuario consegue criar uma nova transação', async () => {
  const response = await request (app.server)
    .post("/transactions")
    .send({
      title:"New transaction",
      amount:5000 ,
      type: 'credit'
    })

    expect(response.statusCode).toEqual(201)
    
})

test('deve ser possivel listar as transações',async()=>{
    const createTransactionResponse = await request (app.server)
    .post("/transactions")
    .send({
      title:"New transaction",
      amount:5000 ,
      type: 'credit'
    })
    const cookies = createTransactionResponse.get('Set-Cookie')
     if (!cookies) {
    throw new Error('Cookie não foi retornado')
     }

    const listTransactionsResponse =  await request(app.server)
    .get("/transactions")
    .set('Cookie',cookies) //envia os cookies


    const transactionId  = listTransactionsResponse.body.transactions[0].id
    
    const getTransationResponse = await request(app.server)
    .get(`/transactions/${transactionId}`)
    .set('Cookie', cookies)
    .expect(200)

    expect(getTransationResponse.body.transactions).toEqual(
      expect.objectContaining({
              title:"New transaction",
              amount:5000 
              
      })
    )
    console.log(listTransactionsResponse.body)
  })

test('deve ser possivel fazer um resumo das transações', async()=>{
    const createTransactionResponse = await request (app.server)
    .post("/transactions")
    .send({
      title:"Credit transaction",
      amount:5000 ,
      type: 'credit'
    })
    const cookies = createTransactionResponse.get('Set-Cookie')
     if (!cookies) {
    throw new Error('Cookie não foi retornado')
     }


   await request(app.server)
  .post('/transactions')
  .set('Cookie',cookies)
  .send({
    title: 'Debit Transaction',
    amount: 2000,
    type: 'debit'
  })

  const summaryResponse = await request(app.server)
  .get('/transactions/summary')
  .set('Cookie',cookies)


  expect(summaryResponse.body).toEqual({
    amount: 3000
  })
 })

})
