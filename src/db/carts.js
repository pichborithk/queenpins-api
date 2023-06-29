const { db } = require('../config/default');
const { getPicturesByProductId } = require('./pictures');
const { getReviewsByProductId } = require('./reviews');
// const { attachPhotosToProducts } = require('./photos');

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

async function updateProductInCart({ userId, productId, quantity }) {
  try {
    const { rows } = await db.query(
      `
        UPDATE carts
        SET quantity=$3
        WHERE "userId"=$1
        AND "productId"=$2
        RETURNING *;
      `,
      [userId, productId, quantity]
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
        SELECT carts."productId" as id, carts.quantity,
        products.title, products.description, products.price
        FROM carts
        JOIN products 
        ON carts."productId"=products.id
        WHERE "userId"=$1
      `,
      [userId]
    );

    const carts = await Promise.all(
      rows.map(async product => {
        product.pictures = await getPicturesByProductId(product.id);
        product.reviews = await getReviewsByProductId(product.id);
        return product;
      })
    );
    console.log(carts);
    // await attachPhotosToProducts(rows);
    return carts;
  } catch (error) {
    console.error(error);
  }
}

async function removeProductInCart({ userId, productId }) {
  try {
    const { rows } = await db.query(
      `
        DELETE FROM carts
        WHERE "productId"=$2
        AND "userId"=$1
        RETURNING *;
      `,
      [userId, productId]
    );

    return rows[0];
  } catch (error) {
    console.error(error);
  }
}

module.exports = {
  addProductToCart,
  checkProductInCart,
  updateProductInCart,
  getUserCart,
  removeProductInCart,
};
