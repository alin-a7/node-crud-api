
import Application from '@/framework/Application'
import { jsonMiddleware, urlMiddleware } from '@/framework/middleware'

import { userRouter } from '@/users'

const PORT = Number(process.env.PORT)
const BASE_URL = process.env.BASE_URL || 'http://localhost'

const app = new Application()

app.use(jsonMiddleware)
app.use(urlMiddleware(`${BASE_URL}:${PORT}`))
app.addRouter(userRouter)

app.listen(PORT, () => {
  console.log(`🛠️  Worker ${process.pid} is running on ${BASE_URL}:${PORT}`)
})
