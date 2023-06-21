const express = require('express');
const router = express.Router();

// ROUTER: /api/users
const usersRouter = require('./users');
router.use('/users', usersRouter);

// ROUTER: /api/products
const productsRouter = require('./products');
router.use('/products', productsRouter);

// ROUTER: /api/carts
const cartsRouter = require('./carts');
router.use('/carts', cartsRouter);

// Error handling
router.use((error, req, res, next) => {
  res.status(401).json({
    error: error.name,
    message: error.message,
    data: null,
    success: false,
  });
});

module.exports = router;
