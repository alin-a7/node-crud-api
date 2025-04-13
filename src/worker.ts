import Application from '@/framework/Application'
import { jsonMiddleware, urlMiddleware } from '@/framework/middleware'

import { AppDataSource } from './typeorm.config'

import { userRouter } from '@/users'

const PORT = Number(process.env.PORT)
const BASE_URL = process.env.BASE_URL || 'http://localhost'

const app = new Application()

app.use(jsonMiddleware)
app.use(urlMiddleware(`${BASE_URL}:${PORT}`))

app.addRouter(userRouter)

const start = async () => {
  AppDataSource.initialize()

    .then(() => {
      console.log('📦 Connected to PostgreSQL')
      try {
        app.listen(PORT, () =>
          console.log(`🛠️  Worker ${process.pid} is running on ${BASE_URL}:${PORT}`),
        )
      } catch (e) {
        console.log(e)
      }
    })
    .catch((error) => console.error('Database connection error:', error))
}

start()
