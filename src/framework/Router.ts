import { Endpoint, HttpMethod, RequestHandler } from './types'

type Route = {
  method: HttpMethod
  path: string
  handler: RequestHandler
  paramNames: string[]
  regex: RegExp
}

export default class Router {
  private routes: Route[] = []

  get(path: string, handler: RequestHandler) {
    this.addRoute(HttpMethod.GET, path, handler)
  }

  post(path: string, handler: RequestHandler) {
    this.addRoute(HttpMethod.POST, path, handler)
  }

  put(path: string, handler: RequestHandler) {
    this.addRoute(HttpMethod.PUT, path, handler)
  }

  delete(path: string, handler: RequestHandler) {
    this.addRoute(HttpMethod.DELETE, path, handler)
  }

  patch(path: string, handler: RequestHandler) {
    this.addRoute(HttpMethod.PATCH, path, handler)
  }

  match(method: string, pathname: string) {
    for (const route of this.routes) {
      if (route.method !== method.toUpperCase()) continue

      const match = pathname.match(route.regex)
      if (match) {
        const params: Record<string, string> = {}
        route.paramNames.forEach((name, i) => {
          params[name] = match[i + 1]
        })

        return {
          handler: route.handler,
          params,
        }
      }
    }

    return null
  }

  private addRoute(method: HttpMethod, path: string, handler: RequestHandler) {
    const { regex, paramNames } = this.pathToRegex(path)
    this.routes.push({ method, path, handler, regex, paramNames })
  }

  private pathToRegex(path: string) {
    const paramNames: string[] = []
    const regexString = path
      .split('/')
      .map((part) => {
        if (part.startsWith(':')) {
          paramNames.push(part.slice(1))
          return '([^/]+)'
        }
        return part
      })
      .join('/')

    return {
      regex: new RegExp(`^${regexString}$`),
      paramNames,
    }
  }
}
