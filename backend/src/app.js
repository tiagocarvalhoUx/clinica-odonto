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

// Middlewares
app.use(
  cors({
    origin: (origin, callback) => {
      const allowed = (process.env.CORS_ORIGIN || "http://localhost:5173").split(",").map(o => o.trim());
      if (!origin || allowed.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
  }),
);
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
