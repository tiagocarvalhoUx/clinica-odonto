import { PrismaClient } from "@prisma/client";

// URL do Neon PostgreSQL - SUBSTITUIR quando criar o banco
const DATABASE_URL = process.env.DATABASE_URL || "postgresql://user:pass@localhost:5432/db";

console.log("Initializing Prisma Client...");

// Configurar Prisma com a URL correta
process.env.DATABASE_URL = DATABASE_URL;

const prisma = new PrismaClient({
  log: ["error", "warn"],
});

// Test connection on startup
prisma.$connect()
  .then(() => console.log("✅ Prisma connected successfully"))
  .catch((err) => console.error("❌ Prisma connection failed:", err.message));

export default prisma;
