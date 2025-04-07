import Router from '@/framework/Router'
import * as UserController from './user-controller'

export const userRouter = new Router()

userRouter.get('/users', UserController.getAllUsers)
userRouter.get('/users/:id', UserController.getUser)
userRouter.post('/users', UserController.createUser)
userRouter.put('/users/:id', UserController.updateUser)
userRouter.delete('/users/:id', UserController.deleteUser)
