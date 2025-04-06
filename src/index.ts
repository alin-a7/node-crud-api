import 'dotenv/config'

import Application from '@/framework/Application'
import { jsonMiddleware, urlMiddleware } from '@/framework/middleware'

import { userRouter } from './users'

const NODE_ENV = process.env.NODE_ENV || 'development'
const PORT = Number(process.env.PORT) || 3000
const BASE_URL = process.env.BASE_URL || 'http://localhost'

const app = new Application()

app.use(jsonMiddleware)
app.use(urlMiddleware(`${BASE_URL}:${PORT}`))

app.addRouter(userRouter)

const start = async () => {
  try {
    app.listen(PORT, () =>
      console.log(`🚀 Server running in ${NODE_ENV} mode on ${BASE_URL}:${PORT}`),
    )
  } catch (e) {
    console.log(e)
  }
}

start()
