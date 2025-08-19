function notFound(req, res, next) {
  const error = new Error(`Not Found - ${req.originalUrl}`);
  res.status(404);
  next(error);
}

function errorHandler(err, _req, res, _next) {
  const statusCode = res.statusCode && res.statusCode !== 200 ? res.statusCode : 500;
  const message = err.message || 'Server error';
  if (statusCode === 500) console.error(err);
  res.status(statusCode).json({
    message,
    stack: process.env.NODE_ENV === 'production' ? '' : err.stack
  });
}

module.exports = { notFound, errorHandler };
