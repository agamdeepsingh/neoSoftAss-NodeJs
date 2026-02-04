const { uuidParamSchema } = require('../validators/taskValidator');

module.exports = (req, res, next) => {
  const parsed = uuidParamSchema.safeParse(req.params.id);
  if (!parsed.success) {
    const err = new Error('Invalid task ID format');
    err.status = 400;
    err.details = parsed.error.format();
    throw err;
  }
  req.params.id = parsed.data;
  next();
};
