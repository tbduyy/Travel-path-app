import { PrismaClient } from "@prisma/client";

const prismaClientSingleton = () => {
  // Keep pool settings configurable instead of forcing a single connection.
  const url = process.env.DATABASE_URL;
  let newUrl = url;
  const connectionLimit = process.env.PRISMA_CONNECTION_LIMIT || "5";
  const poolTimeout = process.env.PRISMA_POOL_TIMEOUT || "20";

  if (url) {
    const hasConnectionLimit = url.includes("connection_limit=");
    const hasPoolTimeout = url.includes("pool_timeout=");
    const separator = url.includes("?") ? "&" : "?";
    const extraParams: string[] = [];

    if (!hasConnectionLimit) {
      extraParams.push(`connection_limit=${connectionLimit}`);
    }
    if (!hasPoolTimeout) {
      extraParams.push(`pool_timeout=${poolTimeout}`);
    }

    if (extraParams.length > 0) {
      newUrl = `${url}${separator}${extraParams.join("&")}`;
    }
  }

  return new PrismaClient({
    datasources: {
      db: {
        url: newUrl,
      },
    },
  });
};

type PrismaClientSingleton = ReturnType<typeof prismaClientSingleton>;

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClientSingleton | undefined;
};

const prisma = globalForPrisma.prisma ?? prismaClientSingleton();

export default prisma;

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
