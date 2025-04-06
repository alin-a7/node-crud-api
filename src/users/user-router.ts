import Router from '@/framework/Router'

export const userRouter = new Router()

userRouter.get('/users', (req, res) => {
  res.end('<h1>Hello world!</h1><h2>This is a test</h2><h3>/users</h3>')
})
