import { RequestWithBody } from '../types'

export function urlMiddleware(baseUrl: string) {
  return (req: RequestWithBody) => {
    if (!req.url) {
      throw new Error('Request url is required')
    }

    const parsedUrl = new URL(req.url, baseUrl)
    const params: Record<string, string> = {}

    parsedUrl.searchParams.forEach((value, key) => (params[key] = value))

    req.pathname = parsedUrl.pathname
    req.params = params
  }
}
