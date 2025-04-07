import { ServerResponse } from 'http'

import { APIError, RequestWithBody } from '../types'

export function jsonMiddleware(req: RequestWithBody, res: ServerResponse) {
  res.setHeader('Content-Type', 'application/json')

  res.send = function (data: any) {
    this.end(JSON.stringify(data))
  }

  res.sendError = function (data: APIError) {
    this.send(data)
  }

  try {
    const url = new URL(req.url || '', `http://${req.headers.host}`)
    req.pathname = url.pathname
  } catch (error) {
    res.statusCode = 400
    res.send({ code: 400, message: 'Invalid URL' })
  }
}
