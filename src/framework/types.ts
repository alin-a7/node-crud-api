import { IncomingMessage, ServerResponse } from 'http'

export type RequestHandler = (req: RequestWithBody, res: ServerResponse) => void

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
  [method: string]: RequestHandler
}

export interface RequestWithBody extends IncomingMessage {
  body?: any
  pathname?: string
  params?: Record<string, string>
  routeParams?: Record<string, string>
}

export interface APIError {
  code: string
  message: string
}

export enum ERROR_CODE {
  BAD_REQUEST = 'BAD_REQUEST',
  NOT_FOUND = 'NOT_FOUND',
}
