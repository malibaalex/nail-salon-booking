import "server-only"

import { unstable_rethrow } from "next/navigation"
import { prisma } from "./db"
import logger from "../../utils"

export type Result<T> = { ok: true; data: T } | { ok: false; error: string }

export type Pagination = {
  skip: number
  take: number
}

export type Paginated<T> = {
  items: T[]
  total: number
  page: number
  pageSize: number
  totalPages: number
}

const PAGE_SIZE = 10
const MAX_PAGE_SIZE = 100

export const createBaseService = (serviceName: string) => {
  const database = prisma

  const safe = async <T>(fn: () => Promise<T>): Promise<Result<T>> => {
    try {
      return {
        ok: true,
        data: await fn(),
      }
    } catch (error) {
      unstable_rethrow(error)

      logger.error({ err: error, service: serviceName }, "Database transaction error")

      return {
        ok: false,
        error: "Something went wrong",
      }
    }
  }

  const paginate = (page = 1, pageSize = PAGE_SIZE) => {
    const currentPage = Math.max(1, Math.floor(page) || 1)

    const take = Math.min(MAX_PAGE_SIZE, Math.max(1, Math.floor(pageSize) || PAGE_SIZE))

    return {
      page: currentPage,
      pageSize: take,
      take,
      skip: (currentPage - 1) * take,
    }
  }

  return {
    database,
    safe,
    paginate,
  }
}
