import { PrismaPg } from "@prisma/adapter-pg"
import { PrismaClient } from "@/src/generated/prisma/client"
import { serverEnv } from "../../core/env/server"

const adapter = new PrismaPg({ connectionString: serverEnv.DATABASE_URL })
const prisma = new PrismaClient({ adapter })

export { prisma }
