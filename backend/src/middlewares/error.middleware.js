export const errorHandler = (err, req, res, next) => {
  console.error("Error:", err);
  console.error("Error stack:", err.stack);
  console.error("Error code:", err.code);
  console.error("Error meta:", err.meta);

  // Prisma errors
  if (err.code === "P2002") {
    return res.status(409).json({
      error: "Registro duplicado",
      field: err.meta?.target,
    });
  }

  if (err.code === "P2025") {
    return res.status(404).json({
      error: "Registro não encontrado",
    });
  }

  // Validation errors
  if (err.name === "ValidationError") {
    return res.status(400).json({
      error: "Erro de validação",
      details: err.details,
    });
  }

  // Default error
  const statusCode = err.statusCode || 500;
  res.status(statusCode).json({
    error: err.message || "Erro interno do servidor",
    ...(process.env.NODE_ENV === "development" && { stack: err.stack }),
  });
};

export const notFoundHandler = (req, res) => {
  res.status(404).json({
    error: "Rota não encontrada",
    path: req.originalUrl,
  });
};
