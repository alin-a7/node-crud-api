import { UserDTO } from '../types'
import { User } from './UserEntity'

import { AppDataSource } from '@/typeorm.config'

const repo = AppDataSource.getRepository(User)

export const getAllUsers = () => repo.find()

export const getUser = (id: string) => repo.findOneBy({ id })

export const createUser = async (userDTO: UserDTO) => {
  const user = repo.create(userDTO)
  return await repo.save(user)
}

export const updateUser = async (id: string, userDTO: Partial<UserDTO>) => {
  const user = await repo.findOneBy({ id })
  if (!user) return null

  Object.assign(user, userDTO)
  return await repo.save(user)
}

export const deleteUser = async (id: string) => {
  const result = await repo.delete(id)
  return result.affected !== 0
}
