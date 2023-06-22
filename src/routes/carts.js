const express = require('express');

const deserializeUser = require('../middleware/deserializeUser');

const {
  checkProductInCart,
  updateProductInCart,
  addProductToCart,
  getUserCart,
  removeProductInCart,
} = require('../db');

const router = express.Router();

router.post('/', deserializeUser, async (req, res, next) => {
  if (!req.user) {
    return next({
      name: 'AuthorizationHeaderError',
      message: 'You must be logged in to perform this action',
    });
  }

  try {
    const userId = req.user.id;
    const { productId, quantity } = req.body;

    const _productInCart = await checkProductInCart({ userId, productId });
    if (_productInCart) {
      if (_productInCart.quantity !== quantity) {
        const productInCart = await updateProductInCart({
          userId,
          productId,
          quantity,
        });
        return res.status(200).json({
          success: true,
          error: null,
          message: 'Success update product in cart',
          data: productInCart,
        });
      } else {
        return res.status(200).json({
          success: true,
          error: null,
          message: 'Nothing to update',
          data: _productInCart,
        });
      }
    }

    const productInCart = await addProductToCart({
      userId,
      productId,
      quantity,
    });

    res.status(200).json({
      success: true,
      error: null,
      message: 'Success add new product in cart',
      data: productInCart,
    });
  } catch (error) {
    next(error);
  }
});

router.get('/me', deserializeUser, async (req, res, next) => {
  if (!req.user) {
    return next({
      name: 'AuthorizationHeaderError',
      message: 'You must be logged in to perform this action',
    });
  }

  try {
    const userId = req.user.id;
    const cart = await getUserCart(userId);

    res.status(200).json({
      success: true,
      message: `Success fetch user cart`,
      error: null,
      data: cart,
    });
  } catch (error) {
    next(error);
  }
});

router.patch('/', deserializeUser, async (req, res, next) => {
  if (!req.user) {
    return next({
      name: 'AuthorizationHeaderError',
      message: 'You must be the owner to perform this action',
    });
  }

  try {
    const userId = req.user.id;
    const { productId, quantity } = req.body;

    const productInCart = await updateProductInCart({
      userId,
      productId,
      quantity,
    });

    res.status(200).json({
      success: true,
      message: `Success update product in cart`,
      error: null,
      data: productInCart,
    });
  } catch (error) {
    next(error);
  }
});

router.delete('/', deserializeUser, async (req, res, next) => {
  if (!req.user) {
    return next({
      name: 'AuthorizationHeaderError',
      message: 'You must be the owner to perform this action',
    });
  }

  try {
    const userId = req.user.id;
    const { productId } = req.body;

    const _productInCart = await removeProductInCart({ userId, productId });

    res.status(200).json({
      success: true,
      message: `Success remove product from cart`,
      error: null,
      data: _productInCart,
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
