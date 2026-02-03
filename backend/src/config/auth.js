import dotenv from "dotenv";

dotenv.config();

export const authConfig = {
  jwtSecret: process.env.JWT_SECRET || "your_secret_key",
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || "7d",
  bcryptSaltRounds: 10,
};
