
import { PrismaClient } from "@prisma/client"

const prismaClientSingleton = () => {
    // Append connection_limit=1 to prevent connection exhaustion in serverless/build environments
    const url = process.env.DATABASE_URL;
    let newUrl = url;
    if (url && !url.includes("connection_limit")) {
        newUrl = url.includes("?")
            ? `${url}&connection_limit=1`
            : `${url}?connection_limit=1`;
    }

    return new PrismaClient({
        datasources: {
            db: {
                url: newUrl,
            },
        },
    })
}

type PrismaClientSingleton = ReturnType<typeof prismaClientSingleton>

const globalForPrisma = globalThis as unknown as {
    prisma: PrismaClientSingleton | undefined
}

const prisma = globalForPrisma.prisma ?? prismaClientSingleton()

export default prisma

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma
