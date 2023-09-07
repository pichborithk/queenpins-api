const express = require('express');
const deserializeUser = require('../middleware/deserializeUser');
const { createReview } = require('../db');

const router = express.Router();

router.post('/:productId', deserializeUser, async (req, res, next) => {
  if (!req.user) {
    return next({
      name: 'AuthorizationHeaderError',
      message: 'You must be logged in to perform this action',
    });
  }

  try {
    const userId = req.user.id;
    const { productId } = req.params;
    const { content, rate } = req.body;
    const review = await createReview({ content, rate, productId, userId });
    review.name = req.user.name;

    res.status(200).json({
      success: true,
      error: null,
      message: 'Success submit new review',
      data: review,
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
