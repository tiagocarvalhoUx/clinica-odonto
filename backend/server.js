import app from "./src/app.js";
import dotenv from "dotenv";
import prisma from "./src/config/database.js";

dotenv.config();

const PORT = process.env.PORT || 3000;

// Verificar conexão com banco de dados
// Only connect explicitly when not running in Vercel serverless functions
if (!process.env.VERCEL) {
  prisma
    .$connect()
    .then(() => console.log("📦 Database connected"))
    .catch((err) => console.error("❌ Database connection error:", err));
} else {
  console.log(
    "ℹ️ Running on Vercel serverless — skipping explicit prisma.$connect()",
  );
}

// Para desenvolvimento local
if (process.env.NODE_ENV !== "production") {
  app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
    console.log(`📍 Environment: ${process.env.NODE_ENV || "development"}`);
    console.log(`🔗 Health check: http://localhost:${PORT}/health`);
  });
}

// Export para Vercel Serverless
export default app;
