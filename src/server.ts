import { app } from './app'
import { env } from './env'

const port = env.PORT
app
  .listen({
    port,
  })
  .then(() => {
    console.log(env.NODE_ENV)
    console.log(`servidor iniciado na porta ${port}`)
    console.log('HTTP server runnig')
  })
