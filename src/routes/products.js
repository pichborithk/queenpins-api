const express = require('express');
const {
  getProducts,
  createProduct,
  updateProduct,
  deleteProduct,
} = require('../db/products');
const deserializeUser = require('../middleware/deserializeUser');
const { createPhoto, updatePhotosOfProduct } = require('../db');

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
    });

    product.photos = [];

    if (urls.length > 0) {
      const photos = await Promise.all(
        urls.map(url => createPhoto(product.id, url))
      );
      product.photos = photos;
    }

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

router.patch('/:productId', deserializeUser, async (req, res, next) => {
  if (req.user.type !== 'admin') {
    return next({
      name: 'AuthorizationHeaderError',
      message: 'You must be an admin to perform this action',
    });
  }

  try {
    const { productId } = req.params;
    const { name, description, price, quantity, urls } = req.body;
    const product = await updateProduct({
      productId,
      name,
      description,
      price,
      quantity,
    });

    product.photos = await updatePhotosOfProduct(productId, urls);

    res.status(200).json({
      success: true,
      error: null,
      message: 'Success update product',
      data: product,
    });
  } catch (error) {
    next(error);
  }
});

router.delete('/:productId', deserializeUser, async (req, res, next) => {
  if (req.user.type !== 'admin') {
    return next({
      name: 'AuthorizationHeaderError',
      message: 'You must be an admin to perform this action',
    });
  }

  try {
    const { productId } = req.params;
    const _product = await deleteProduct(productId);

    res.status(200).json({
      success: true,
      error: null,
      message: 'Success delete product',
      data: _product,
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
