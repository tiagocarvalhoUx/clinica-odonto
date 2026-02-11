import { PrismaClient } from "@prisma/client";

// Forçar URL correta - ignorar variável de ambiente que pode estar errada
const DATABASE_URL = "mysql://root:GmsgWnHJmPzuljWrRSxfUPLQVUJIIhWC@crossover.proxy.rlwy.net:56088/railway";

console.log("Initializing Prisma Client...");
console.log("DATABASE_URL:", DATABASE_URL);

// Configurar Prisma com a URL correta
process.env.DATABASE_URL = DATABASE_URL;

const prisma = new PrismaClient({
  log: ["error", "warn", "info"],
});

// Test connection on startup
prisma.$connect()
  .then(() => console.log("✅ Prisma connected successfully"))
  .catch((err) => console.error("❌ Prisma connection failed:", err.message));

export default prisma;
