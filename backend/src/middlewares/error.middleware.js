export function errorMiddleware(error, req, res, next) {
  const status = error.statusCode || 500;
  const message = status === 500 ? "Internal server error" : error.message;

  if (status === 500) {
    console.error(error);
  }

  res.status(status).json({
    success: false,
    message,
    details: error.details || undefined
  });
}
