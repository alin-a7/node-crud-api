import http, { Server, ServerResponse } from 'http'

import Router from './Router'
import { RequestWithBody } from './types'

import { ERROR_CODES, ERROR_MESSAGES } from '@/constants'

type Middleware = (req: RequestWithBody, res: ServerResponse) => void

export default class Application {
  private server: Server
  private middlewares: Middleware[]
  private routers: Router[] = []

  constructor() {
    this.server = this.createServer()
    this.middlewares = []
  }

  use(middleware: Middleware) {
    this.middlewares.push(middleware)
  }

  listen(port: number, callback?: () => void) {
    this.server.listen(port, callback)
  }

  addRouter(router: Router) {
    this.routers.push(router)
  }

  getServer() {
    return this.server
  }

  private createServer(): Server {
    return http.createServer(async (req: RequestWithBody, res: ServerResponse) => {
      let body = ''

      req.on('data', (chunk: Buffer) => {
        body += chunk.toString()
      })

      req.on('end', async () => {
        try {
          if (body) {
            req.body = JSON.parse(body)
          }

          this.applyMiddlewares(req, res)

          let matched = false

          for (const router of this.routers) {
            const result = router.match(req.method || '', req.pathname || '')

            if (result) {
              req.routeParams = result.params
              await Promise.resolve(result.handler(req, res))
              matched = true
              break
            }
          }

          if (!matched) {
            console.log('404 NOT FOUND:', req.pathname || '')
            res.statusCode = 404
            res.sendError({ code: ERROR_CODES.notFound, message: ERROR_MESSAGES.endpointNotFound })
          }
        } catch (error) {
          console.error('500 ERROR: ', error)
          res.statusCode = 500
          res.end(ERROR_MESSAGES.serverError)
        }
      })
    })
  }

  private applyMiddlewares(req: RequestWithBody, res: ServerResponse) {
    this.middlewares.forEach((middleware) => middleware(req, res))
  }
}
