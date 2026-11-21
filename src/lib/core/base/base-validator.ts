import "server-only"

import { z } from "zod"

export const createValidator = <T extends z.ZodType>(schema: T) => {
  return {
    schema,

    validate: (data: unknown) => schema.safeParseAsync(data),
  }
}
