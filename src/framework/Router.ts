import { Endpoint, HttpMethod, RequestHandler } from './types'

export default class Router {
  private endpoints: Record<string, Endpoint> = {}

  get(path: string, handler: RequestHandler) {
    this.request(HttpMethod.GET, path, handler)
  }

  post(path: string, handler: RequestHandler) {
    this.request(HttpMethod.POST, path, handler)
  }

  put(path: string, handler: RequestHandler) {
    this.request(HttpMethod.PUT, path, handler)
  }

  delete(path: string, handler: RequestHandler) {
    this.request(HttpMethod.DELETE, path, handler)
  }

  patch(path: string, handler: RequestHandler) {
    this.request(HttpMethod.PATCH, path, handler)
  }

  getEndpoints(): Record<string, Endpoint> {
    return this.endpoints
  }

  private request(method: HttpMethod, path: string, handler: RequestHandler): void {
    if (!path.startsWith('/')) {
      throw new Error(`Path must start with a slash. Received: ${path}`)
    }

    const endpoint = (this.endpoints[path] ??= {})

    if (endpoint[method]) {
      throw new Error(`[${method}] handler for path ${path} already exists`)
    }

    endpoint[method] = handler
  }
}
