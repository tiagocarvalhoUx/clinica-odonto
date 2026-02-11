import { PrismaClient } from "@prisma/client";

console.log("Initializing Prisma Client...");
console.log("DATABASE_URL exists:", !!process.env.DATABASE_URL);

const prisma = new PrismaClient({
  log: ["error", "warn", "info"],
});

// Test connection on startup
prisma.$connect()
  .then(() => console.log("✅ Prisma connected successfully"))
  .catch((err) => console.error("❌ Prisma connection failed:", err.message));

export default prisma;
