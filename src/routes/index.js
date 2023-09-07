const express = require('express');
const router = express.Router();

// ROUTER: /api/users
const usersRouter = require('./users');
router.use('/users', usersRouter);

// ROUTER: /api/products
const productsRouter = require('./products');
router.use('/products', productsRouter);

// ROUTER: /api/reviews
const reviewsRouter = require('./reviews');
router.use('/reviews', reviewsRouter);

// ROUTER: /api/carts
const cartsRouter = require('./carts');
router.use('/carts', cartsRouter);

// ROUTER: /api/checkout
const checkoutRouter = require('./checkout');
router.use('/checkout', checkoutRouter);

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
