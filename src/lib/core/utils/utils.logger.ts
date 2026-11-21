import "server-only"
import pino from "pino"

const nodeEnv = process.env.NODE_ENV
const isTest = nodeEnv === "test"
const isDev = nodeEnv === "development"
const level = process.env.LOG_LEVEL ?? (isTest ? "silent" : isDev ? "debug" : "info")

// File logging only works on a long-running server (VPS/Docker), not serverless.
const logToFile = process.env.LOG_TO_FILE === "true"

const createLogger = (): pino.Logger => {
  const targets: pino.TransportTargetOptions[] = [
    isDev
      ? { target: "pino-pretty", level, options: { colorize: true } }
      : { target: "pino/file", level, options: { destination: 1 } },
  ]

  if (logToFile) {
    targets.push({
      target: "pino-roll",
      level,
      options: {
        file: "./logs/app",
        extension: ".log",
        frequency: "daily",
        dateFormat: "yyyy-MM-dd",
        mkdir: true,
        symlink: true,
        limit: { count: 1 },
      },
    })
  }

  return pino(
    {
      level,
      timestamp: pino.stdTimeFunctions.isoTime,
      redact: ["req.headers.authorization", "req.headers.cookie", 'res.headers["set-cookie"]'],
    },
    isTest ? undefined : pino.transport({ targets }),
  )
}

// Cached on globalThis so hot reload doesn't spawn new transport workers.
const g = globalThis as unknown as { logger?: pino.Logger }
export const logger = g.logger ?? createLogger()
if (nodeEnv !== "production") g.logger = logger
