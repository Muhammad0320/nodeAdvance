const { clearCache } = require('../services/cache');

const cleanCache = async (req, res, next) => {
  await next();

  clearCache(req.user.id);
};

module.exports = cleanCache;
