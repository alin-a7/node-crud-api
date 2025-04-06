import { IncomingMessage, ServerResponse } from 'http'

export type RequestHandler = (req: IncomingMessage, res: ServerResponse) => void

export enum HttpMethod {
  GET = 'GET',
  POST = 'POST',
  PUT = 'PUT',
  DELETE = 'DELETE',
  PATCH = 'PATCH',
  HEAD = 'HEAD',
  OPTIONS = 'OPTIONS',
}

export interface Endpoint {
  [method: string]: (req: IncomingMessage, res: ServerResponse) => void
}

export interface RequestWithBody extends IncomingMessage {
  body?: any
  pathname?: string
  params?: Record<string, string>
}
