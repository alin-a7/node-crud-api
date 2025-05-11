import { ServerResponse } from 'http'

import { RequestWithBody } from '@/framework/types'

import { ERROR_CODES, ERROR_MESSAGES } from '@/constants'

import { UserOmitId } from './types'
import * as UserModel from './user-model'
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
    res.sendError({ code: ERROR_CODES.badRequest, message: userIdError })
    return
  }

  const user = UserModel.getUser(String(userId))

  if (!user) {
    res.statusCode = 404
    res.sendError({ code: ERROR_CODES.notFound, message: ERROR_MESSAGES.userNotFound })
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
      res.sendError({ code: ERROR_CODES.badRequest, message: ERROR_MESSAGES.fieldRequired(field) })
      return
    }

    if (isArray && !Array.isArray(bodyValue)) {
      res.statusCode = 400
      res.sendError({ code: ERROR_CODES.badRequest, message: ERROR_MESSAGES.fieldIsArray(field) })
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
    res.sendError({ code: ERROR_CODES.badRequest, message: userIdError })
    return
  }

  const hobbies = req.body.hobbies

  if (hobbies && !Array.isArray(hobbies)) {
    res.statusCode = 400
    res.sendError({ code: ERROR_CODES.badRequest, message: ERROR_MESSAGES.fieldIsArray('hobbies') })
    return
  }

  const user = UserModel.updateUser(String(userId), req.body)

  if (!user) {
    res.statusCode = 404
    res.sendError({ code: ERROR_CODES.notFound, message: ERROR_MESSAGES.userNotFound })
    return
  }

  res.send(user)
}

export const deleteUser = async (req: RequestWithBody, res: ServerResponse) => {
  const userId = req?.routeParams?.id
  const userIdError = validateUserId(userId)

  if (userIdError) {
    res.statusCode = 400
    res.sendError({ code: ERROR_CODES.badRequest, message: userIdError })
    return
  }

  const hasUser = UserModel.deleteUser(String(userId))

  if (!hasUser) {
    res.statusCode = 404
    res.sendError({ code: ERROR_CODES.notFound, message: ERROR_MESSAGES.userNotFound })
    return
  }

  res.statusCode = 204
  res.send()
}
