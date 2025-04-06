import { ServerResponse } from 'http'
import { RequestWithBody } from '../types'

export function jsonMiddleware() {
  return (req: RequestWithBody, res: ServerResponse) => {
    res.setHeader('Content-Type', 'application/json')

    const sendJson = (data: any) => {
      res.end(JSON.stringify(data))
    }

    if (['POST', 'PUT', 'PATCH'].includes(req.method || '')) {
      let body = ''

      req.on('data', (chunk: Buffer) => {
        body += chunk.toString()
      })

      req.on('end', () => {
        try {
          if (body) {
            req.body = JSON.parse(body)
          }
          const url = new URL(req.url || '', `http://${req.headers.host}`)
          req.pathname = url.pathname
        } catch (error) {
          res.statusCode = 400
          sendJson({ error: 'Invalid JSON' })
        }
      })
    }
  }
}
