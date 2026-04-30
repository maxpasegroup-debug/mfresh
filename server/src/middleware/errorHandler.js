export function errorHandler(error, _req, res, _next) {
  let status = error.status || 500;
  let message = error.message || 'Internal server error';

  if (error.code === '23505') {
    status = 409;
    message = 'Already exists';
  }

  if (error.code === '23503') {
    status = 400;
    message = 'Reference not found';
  }

  if (error.name === 'JsonWebTokenError') {
    status = 401;
    message = 'Invalid token';
  }

  if (error.name === 'TokenExpiredError') {
    status = 401;
    message = 'Token expired';
  }

  if (process.env.NODE_ENV !== 'test') {
    if (process.env.NODE_ENV === 'development') {
      console.error(error.stack);
    } else {
      console.error(error.message);
    }
  }

  res.status(status).json({
    success: false,
    message,
    ...(process.env.NODE_ENV === 'development' ? { stack: error.stack } : {}),
  });
}
