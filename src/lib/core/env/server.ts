import "dotenv/config"
import z from "zod"

const envSchema = z
  .object({
    // Server
    NODE_ENV: z.enum(["development", "test", "production"]).default("development"),

    // Database
    DATABASE_URL: z.string().min(1).optional(), // set in prod
    DEV_DATABASE_URL: z.string().min(1).optional(), // set in development

    // JWT
    JWT_ACCESS_SECRET_KEY: z.string().min(1, "JWT_ACCESS_SECRET_KEY is required"),
    JWT_ACCESS_SECRET_KEY_EXPIRES_IN: z.coerce.number().default(900),
    JWT_REFRESH_SECRET_KEY: z.string().min(1, "JWT_REFRESH_SECRET_KEY is required"),
    JWT_REFRESH_SECRET_KEY_EXPIRES_IN: z.coerce.number().default(604800),

    // Cookie
    COOKIE_SECRET: z.string().min(1, "COOKIE_SECRET is required"),
  })
  .superRefine((env, ctx) => {
    if (!env.DATABASE_URL && !env.DEV_DATABASE_URL) {
      ctx.addIssue({
        code: "custom",
        path: ["DATABASE_URL"],
        message: "Set DATABASE_URL (or DEV_DATABASE_URL for local dev)",
      })
    }
    if (env.NODE_ENV === "production" && !env.DATABASE_URL) {
      ctx.addIssue({
        code: "custom",
        path: ["DATABASE_URL"],
        message: "DATABASE_URL is required in production",
      })
    }
  })
  .transform((env) => ({
    ...env,
    // resolved URL — use env.DATABASE_URL everywhere in the app
    DATABASE_URL: (env.DATABASE_URL ?? env.DEV_DATABASE_URL)!,
  }))

const parsed = envSchema.safeParse(process.env)

if (!parsed.success) {
  console.error("Invalid environment variables:", z.flattenError(parsed.error).fieldErrors)
  throw new Error("Invalid environment variables")
}

/**
- Exports the validated and strictly typed environment object.
- Provides type-safe access configuration across the entire backend application.
 */
const serverEnv = parsed.data
type ServerEnv = typeof serverEnv

export { serverEnv, type ServerEnv }
