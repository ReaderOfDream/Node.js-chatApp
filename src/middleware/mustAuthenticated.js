module.exports = function mustAuthenticated(req, res, next) {
  if (!req.isAuthenticated()) {
    return res.redirect('/login');
  }

  return next();
};
