import { validate as validateUuid } from 'uuid'

import { ERROR_MESSAGES } from '@/constants'

export const validateUserId = (userId: string | undefined): string | null => {
  if (!userId) {
    return ERROR_MESSAGES.userIdRequired
  }

  const isValidUuid = validateUuid(userId)
  if (!isValidUuid) {
    return ERROR_MESSAGES.invalidUserId
  }

  return null
}
