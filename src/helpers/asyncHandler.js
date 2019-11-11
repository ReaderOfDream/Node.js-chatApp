const { EntityNotFoundException } = require('../errors/exceptions');

function catchError(err, req, res, next) {
  if (err instanceof EntityNotFoundException) {
    res.status(404);
    res.send(err.message);
    return;
  }

  next(err);
}

const asyncHandler = fn => (req, res, next) => Promise
  .resolve(fn(req, res, next))
  .catch(err => catchError(err, req, res, next));

module.exports = asyncHandler;
