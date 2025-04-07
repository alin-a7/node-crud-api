import { validate as validateUuid } from 'uuid'

export const validateUserId = (userId: string | undefined): string | null => {
  if (!userId) {
    return 'User id is required'
  }

  const isValidUuid = validateUuid(userId)
  if (!isValidUuid) {
    return 'Invalid UUID format'
  }

  return null
}
