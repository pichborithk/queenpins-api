const jwt = require('jsonwebtoken');

const { getUserById } = require('../db');

async function deserializeUser(req, res, next) {
  const prefix = 'Bearer ';
  const auth = req.headers.authorization;

  if (!auth) {
    next();
  } else if (auth.startsWith(prefix)) {
    const token = auth.slice(prefix.length);
    try {
      const { id, email } = jwt.verify(token, process.env.JWT_SECRET);

      if (id || email) {
        req.user = await getUserById(id);
        next();
      }
    } catch (error) {
      next(error);
    }
  } else {
    next({
      name: 'AuthorizationHeaderError',
      message: `Authorization token must start with ${prefix}`,
    });
  }
}

module.exports = deserializeUser;
