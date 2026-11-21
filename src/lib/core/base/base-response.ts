import { HTTP_MSG, HTTP_STATUS, ResponseKey } from "@/src/shared"
import "server-only"

type ResponseOptions<T = unknown> = {
  message?: string
  data?: T
  requestId?: string
}

const buildResponse = <T = unknown>(key: ResponseKey, options: ResponseOptions<T> = {}) => {
  const status = HTTP_STATUS[key]

  return {
    status,
    message: options.message ?? HTTP_MSG[key],
    timestamp: new Date().toISOString(),
    requestId: options.requestId,
    data: options.data,
  }
}

const jsonResponse = <T = unknown>(
  key: ResponseKey,
  options: ResponseOptions<T> = {},
): Response => {
  return Response.json(buildResponse(key, options), {
    status: HTTP_STATUS[key],
  })
}

export { buildResponse, jsonResponse }
