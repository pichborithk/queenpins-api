const express = require('express');
const { getProducts } = require('../db/products');

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

module.exports = router;
