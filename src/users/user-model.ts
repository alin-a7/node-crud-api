import { v4 as uuidv4 } from 'uuid'

import { User, UserOmitId } from './types'

const users = new Map<string, User>()

export const getAllUsers = () => Array.from(users.values())

export const getUser = (id: string) => users.get(id)

export const createUser = (user: UserOmitId) => {
  const id = uuidv4()
  const newUser = { ...user, id }
  users.set(id, newUser)
  return newUser
}

export const updateUser = (id: string, userData: Partial<User>) => {
  const existingUser = users.get(id)
  if (!existingUser) return null

  const updatedUser = { ...existingUser, ...userData, id }
  users.set(id, updatedUser)
  return updatedUser
}

export const deleteUser = (id: string) => users.delete(id)
