import { PrismaClient } from "@prisma/client";

console.log("Initializing Prisma Client...");

// Use a global singleton to avoid exhausting DB connections in serverless envs
let prisma;

if (process.env.NODE_ENV === "production") {
  prisma = new PrismaClient({ log: ["error", "warn"] });
} else {
  if (!globalThis._prisma) {
    globalThis._prisma = new PrismaClient({ log: ["error", "warn"] });
  }
  prisma = globalThis._prisma;
}

export default prisma;
