const { db } = require('../config/default');

async function addProductToCart({ userId, productId, quantity }) {
  try {
    const { rows } = await db.query(
      `
        INSERT INTO carts("userId", "productId", quantity)
        VALUES ($1, $2, $3)
        ON CONFLICT ("userId", "productId") DO NOTHING;
      `,
      [userId, productId, quantity]
    );

    const [cart] = rows;
    return cart;
  } catch (error) {
    throw error;
  }
}

module.exports = {
  addProductToCart,
};
