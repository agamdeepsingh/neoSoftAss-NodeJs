module.exports = (err, req, res, next) => {
  const status = err.status || 500;
  const response = {
    error: {
      message: err.message || 'Internal Server Error'
    }
  };

  if (err.details) response.error.details = err.details;
  if (process.env.NODE_ENV !== 'production' && err.stack) response.error.stack = err.stack;

  res.status(status).json(response);
};

