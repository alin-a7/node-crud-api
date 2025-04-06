import http, { ServerResponse, Server } from 'http'
import EventEmitter from 'events'

import { RequestWithBody } from './types'
import Router from './Router'

type Middleware = (req: RequestWithBody, res: ServerResponse) => void

export default class Application {
  private emitter: EventEmitter
  private server: Server
  private middlewares: Middleware[]

  constructor() {
    this.emitter = new EventEmitter()
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
    const endpoints = router.getEndpoints()

    Object.keys(endpoints).forEach((path) => {
      const endpoint = endpoints[path]
      
      Object.keys(endpoint).forEach((method) => {
        this.emitter.on(
          this.getRouteMask(path, method),
          (req: RequestWithBody, res: ServerResponse) => {
            const handler = endpoint[method]
            handler(req, res)
          },
        )
      })
    })
  }

  private createServer(): Server {
    return http.createServer((req: RequestWithBody, res: ServerResponse) => {
      let body = ''

      req.on('data', (chunk: Buffer) => {
        body += chunk.toString()
      })

      req.on('end', () => {
        try {
          this.applyMiddlewares(req, res, () => {
            const emitted = this.emitter.emit(
              this.getRouteMask(req.pathname || '', req.method || ''),
              req,
              res,
            )

            if (!emitted) {
              res.statusCode = 404
              res.end('Not Found')
            }
          })
        } catch (error) {
          res.statusCode = 500
          res.end('Internal Server Error')
        }
      })
    })
  }

  private applyMiddlewares(req: RequestWithBody, res: ServerResponse, callback: () => void) {
    this.middlewares.forEach((middleware) => middleware(req, res))
    callback()
  }

  private getRouteMask(path: string, method: string): string {
    return `[${path}]:[${method}]`
  }
}
