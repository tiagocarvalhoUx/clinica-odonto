import { PrismaClient } from "@prisma/client";

// Hardcoded database URL para funcionar na Vercel
const DATABASE_URL = process.env.DATABASE_URL || "mysql://root:GmsgWnHJmPzuljWrRSxfUPLQVUJIIhWC@crossover.proxy.rlwy.net:56088/railway";

console.log("Initializing Prisma Client...");
console.log("Using DATABASE_URL:", DATABASE_URL ? "configured" : "missing");

const prisma = new PrismaClient({
  datasources: {
    db: {
      url: DATABASE_URL,
    },
  },
  log: ["error", "warn", "info"],
});

// Test connection on startup
prisma.$connect()
  .then(() => console.log("✅ Prisma connected successfully"))
  .catch((err) => console.error("❌ Prisma connection failed:", err.message));

export default prisma;
