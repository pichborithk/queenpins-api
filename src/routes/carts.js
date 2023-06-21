const express = require('express');

const deserializeUser = require('../middleware/deserializeUser');

const { checkProductInCart, updateCart, addProductToCart } = require('../db');

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
        const productInCart = await updateCart(_productInCart.id, quantity);
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

// router.get('/me', deserializeUser, async (req, res, next) => {
//   if (!req.user) {
//     return next({
//       name: 'AuthorizationHeaderError',
//       message: 'You must be logged in to perform this action',
//     });
//   }

//   try {
//     const cart = await get

//     res.status(200).json({
//       success: true,
//       message: `Success fetch user information`,
//       error: null,
//       data: {
//         id,
//         email,
//         name,
//         type,
//       },
//     });
//   } catch (error) {
//     next(error);
//   }
// });

module.exports = router;
