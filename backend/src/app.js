import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import authRoutes from "./routes/auth.routes.js";
import patientRoutes from "./routes/patient.routes.js";
import dentistRoutes from "./routes/dentist.routes.js";
import budgetRoutes from "./routes/budget.routes.js";
import reportRoutes from "./routes/report.routes.js";
import {
  errorHandler,
  notFoundHandler,
} from "./middlewares/error.middleware.js";

dotenv.config();

const app = express();

// CORS - Permite qualquer origem
app.use(cors({
  origin: true,
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
}));

// Middleware para garantir headers CORS em todas as respostas
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', req.headers.origin || '*');
  res.header('Access-Control-Allow-Credentials', 'true');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS, PATCH');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With');
  
  // Responde imediatamente a requisições OPTIONS (preflight)
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }
  
  next();
});

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Root route
app.get("/", (req, res) => {
  res.json({
    message: "🦷 Clínica Odontológica API",
    version: "1.0.0",
    status: "online",
    endpoints: {
      health: "/health",
      auth: "/api/auth",
      patients: "/api/patients",
      budgets: "/api/budgets",
      reports: "/api/reports",
    },
  });
});

// Health check
app.get("/health", (req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

// API Routes
app.use("/api/auth", authRoutes);
app.use("/api/patients", patientRoutes);
app.use("/api/dentists", dentistRoutes);
app.use("/api/budgets", budgetRoutes);
app.use("/api/reports", reportRoutes);
// Error handling
app.use(notFoundHandler);
app.use(errorHandler);

export default app;
