const express = require('express');
const { getProducts, createProduct } = require('../db/products');
const deserializeUser = require('../middleware/deserializeUser');

const router = express.Router();

router.get('/', async (req, res, next) => {
  try {
    const products = await getProducts();

    res.status(200).json({
      success: true,
      error: null,
      message: 'Success fetch all products',
      data: {
        products,
      },
    });
  } catch (error) {
    next(error);
  }
});

router.post('/', deserializeUser, async (req, res, next) => {
  if (req.user.type !== 'admin') {
    return next({
      name: 'AuthorizationHeaderError',
      message: 'You must be an admin to perform this action',
    });
  }

  try {
    const { name, description, price, quantity, urls } = req.body;
    const product = await createProduct({
      name,
      description,
      price,
      quantity,
      urls,
    });

    res.status(200).json({
      success: true,
      error: null,
      message: 'Success create new product',
      data: product,
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
