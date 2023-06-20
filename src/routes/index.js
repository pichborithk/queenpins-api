const express = require('express');
const router = express.Router();

// ROUTER: /api/users
const usersRouter = require('./users');
router.use('/users', usersRouter);

// Error handling
router.use((error, req, res, next) => {
  res.status(401).json({
    error: error.name,
    message: error.message,
  });
});

module.exports = router;
