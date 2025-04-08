import { ServerResponse } from 'http'

import { APIError } from './types'

declare module 'http' {
  interface ServerResponse {
    send: (data?: any) => void
    sendError: (error: APIError) => void
  }
}
