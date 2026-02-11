import { PrismaClient } from "@prisma/client";

// Forçar URL correta com SSL
const DATABASE_URL = "mysql://root:GmsgWnHJmPzuljWrRSxfUPLQVUJIIhWC@crossover.proxy.rlwy.net:56088/railway?sslaccept=strict&connect_timeout=30";

console.log("Initializing Prisma Client...");

// Configurar Prisma com a URL correta
process.env.DATABASE_URL = DATABASE_URL;

const prisma = new PrismaClient({
  log: ["error", "warn", "info"],
  __internal: {
    engine: {
      connectionLimit: 5,
    },
  },
});

// Test connection on startup
prisma.$connect()
  .then(() => console.log("✅ Prisma connected successfully"))
  .catch((err) => console.error("❌ Prisma connection failed:", err.message));

export default prisma;
