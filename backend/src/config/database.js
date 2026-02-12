import { PrismaClient } from "@prisma/client";

// Configuração para serverless - connection_limit=1 é obrigatório
const DATABASE_URL = "mysql://root:GmsgWnHJmPzuljWrRSxfUPLQVUJIIhWC@crossover.proxy.rlwy.net:56088/railway?connection_limit=1&pool_timeout=10&connect_timeout=10";

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
