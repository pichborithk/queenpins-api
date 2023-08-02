const express = require('express');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

const deserializeUser = require('../middleware/deserializeUser');

const router = express.Router();

router.post('/', deserializeUser, async (req, res, next) => {
  // if (!req.user) {
  //   return next({
  //     name: 'AuthorizationHeaderError',
  //     message: 'You must be logged in to perform this action',
  //   });
  // }

  try {
    const { cart } = req.body;
    const storeItems = cart.map(product => {
      console.log(product);
      return {
        price_data: {
          currency: 'usd',
          product_data: {
            name: product.title,
          },
          unit_amount: Math.round(
            parseInt(product.price.replace('$', '')) * 100
          ),
        },
        quantity: product.quantity,
      };
    });
    console.log(storeItems);
    const session = await stripe.checkout.sessions.create({
      // shipping_address_collection: { allowed_countries: ['US'] },
      payment_method_types: ['card'],
      mode: 'payment',
      line_items: storeItems,
      success_url: `${process.env.CLIENT_URL}/checkout?success=true`,
      cancel_url: `${process.env.CLIENT_URL}?canceled=true`,
    });

    console.log(session);
    res.status(200).json({
      success: true,
      error: null,
      message: 'Proceed to payment',
      data: { url: session.url },
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
