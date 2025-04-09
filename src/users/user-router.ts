import Router from '@/framework/Router'

import * as UserController from './user-controller'

export const userRouter = new Router()

userRouter.get('/api/users', UserController.getAllUsers)
userRouter.get('/api/users/:id', UserController.getUser)
userRouter.post('/api/users', UserController.createUser)
userRouter.put('/api/users/:id', UserController.updateUser)
userRouter.delete('/api/users/:id', UserController.deleteUser)
