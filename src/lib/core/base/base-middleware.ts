import "server-only"

export type RouteContext = {
  params?: Promise<Record<string, string | string[]>>
  validated?: Record<string, unknown>
  user?: unknown
}

export type Handler = (request: Request, context: RouteContext) => Promise<Response>

export type Middleware = (next: Handler) => Handler

export const composeMiddlewares = (middlewares: Middleware[], handler: Handler): Handler => {
  return middlewares.reduceRight((next, middleware) => middleware(next), handler)
}
