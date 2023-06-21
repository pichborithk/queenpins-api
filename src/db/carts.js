const { db } = require('../config/default');
const { attachPhotosToProducts } = require('./photos');

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

    return rows[0];
  } catch (error) {
    console.error(error);
  }
}

async function checkProductInCart({ userId, productId }) {
  try {
    const { rows } = await db.query(
      `
        SELECT * 
        FROM carts
        WHERE "userId"=$1
        AND "productId"=$2;
      `,
      [userId, productId]
    );

    if (rows.length > 0) {
      return rows[0];
    } else {
      return null;
    }
  } catch (error) {
    console.error(error);
  }
}

async function updateCart(id, quantity) {
  try {
    const { rows } = await db.query(
      `
        UPDATE carts
        SET quantity=$2
        WHERE id=$1
        RETURNING *;
      `,
      [id, quantity]
    );

    return rows[0];
  } catch (error) {
    console.error(error);
  }
}

async function getUserCart(userId) {
  try {
    const { rows } = await db.query(
      `
        SELECT carts."productId" as id, products.* 
        FROM carts
        JOIN products 
        ON carts."productId"=products.id
        WHERE "userId"=$1
      `,
      [userId]
    );

    await attachPhotosToProducts(rows);
    return rows;
  } catch (error) {
    console.error(error);
  }
}

module.exports = {
  addProductToCart,
  checkProductInCart,
  updateCart,
  getUserCart,
};
