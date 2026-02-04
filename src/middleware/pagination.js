const DEFAULT_PAGE = 1;
const DEFAULT_LIMIT = 10;
const MAX_LIMIT = 100;

function pagination(req, res, next) {
  const page = Math.max(parseInt(req.query.page, 10) || DEFAULT_PAGE, 1);
  const limit = Math.min(
    Math.max(parseInt(req.query.limit, 10) || DEFAULT_LIMIT, 1),
    MAX_LIMIT
  );
  req.pagination = { page, limit, offset: (page - 1) * limit };
  next();
}

module.exports = pagination;
