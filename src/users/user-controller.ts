import { ServerResponse } from 'http'

import { ERROR_CODE, RequestWithBody } from '@/framework/types'

import * as UserModel from './user-model'
import { UserOmitId } from './types'
import { validateUserId } from './validation'

export const getAllUsers = async (_req: RequestWithBody, res: ServerResponse) => {
  const users = UserModel.getAllUsers()

  res.send(users)
}

export const getUser = async (req: RequestWithBody, res: ServerResponse) => {
  const userId = req?.routeParams?.id
  const userIdError = validateUserId(userId)

  if (userIdError) {
    res.statusCode = 400
    res.sendError({ code: ERROR_CODE.BAD_REQUEST, message: userIdError })
    return
  }

  const user = UserModel.getUser(String(userId))

  if (!user) {
    res.statusCode = 404
    res.sendError({ code: ERROR_CODE.NOT_FOUND, message: 'User not found' })
    return
  }

  res.send(user)
}

export const createUser = async (req: RequestWithBody, res: ServerResponse) => {
  const userRequiredFields = [
    { field: 'username' },
    { field: 'age' },
    { field: 'hobbies', isArray: true },
  ] as { field: keyof UserOmitId; isArray?: boolean }[]

  for (const { field, isArray } of userRequiredFields) {
    const bodyValue = req?.body[field]

    if (!bodyValue) {
      res.statusCode = 400
      res.sendError({ code: ERROR_CODE.BAD_REQUEST, message: `${field} is required` })
      return
    }

    if (isArray && !Array.isArray(bodyValue)) {
      res.statusCode = 400
      res.sendError({ code: ERROR_CODE.BAD_REQUEST, message: `${field} must be an array` })
      return
    }
  }

  const user = UserModel.createUser(req.body)

  res.statusCode = 201
  res.send(user)
}

export const updateUser = async (req: RequestWithBody, res: ServerResponse) => {
  const userId = req?.routeParams?.id
  const userIdError = validateUserId(userId)

  if (userIdError) {
    res.statusCode = 400
    res.sendError({ code: ERROR_CODE.BAD_REQUEST, message: userIdError })
    return
  }

  const hobbies = req.body.hobbies

  if (hobbies && !Array.isArray(hobbies)) {
    res.statusCode = 400
    res.sendError({ code: ERROR_CODE.BAD_REQUEST, message: 'Hobbies must be an array' })
    return
  }

  const user = UserModel.updateUser(String(userId), req.body)

  if (!user) {
    res.statusCode = 404
    res.sendError({ code: ERROR_CODE.NOT_FOUND, message: 'User not found' })
    return
  }

  res.send(user)
}

export const deleteUser = async (req: RequestWithBody, res: ServerResponse) => {
  const userId = req?.routeParams?.id
  const userIdError = validateUserId(userId)

  if (userIdError) {
    res.statusCode = 400
    res.sendError({ code: ERROR_CODE.BAD_REQUEST, message: userIdError })
    return
  }

  const hasUser = UserModel.deleteUser(String(userId))

  if (!hasUser) {
    res.statusCode = 404
    res.sendError({ code: ERROR_CODE.NOT_FOUND, message: 'User not found' })
    return
  }

  res.statusCode = 204
  res.send()
}
