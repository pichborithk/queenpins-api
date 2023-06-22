const { db } = require('../config/default');
const { attachPhotosToProducts } = require('./photos');
const { attachReviewsToProducts } = require('./reviews');

async function createProduct(fields) {
  const { name, description, price, quantity } = fields;
  try {
    const { rows } = await db.query(
      `
        INSERT INTO products (name, description, price, quantity)
        VALUES ($1, $2, $3, $4)
        ON CONFLICT (name) DO NOTHING
        RETURNING *;
      `,
      [name, description, price, quantity]
    );

    const [product] = rows;

    return product;
  } catch (error) {
    console.error(error);
  }
}

async function getProducts() {
  try {
    const { rows } = await db.query(
      `
        SELECT * 
        FROM products;
      `
    );

    await attachPhotosToProducts(rows);
    await attachReviewsToProducts(rows);
    return rows;
  } catch (error) {
    console.error(error);
  }
}

async function updateProduct({ productId, ...fields }) {
  const setString = Object.keys(fields)
    .map((key, index) => `"${key}"=$${index + 2}`)
    .join(', ');

  try {
    const { rows } = await db.query(
      `
        UPDATE products
        SET ${setString}
        WHERE id=$1
        RETURNING *;
      `,
      [productId, ...Object.values(fields)]
    );

    const [product] = rows;
    return product;
  } catch (error) {
    console.error(error);
  }
}

module.exports = {
  createProduct,
  getProducts,
  updateProduct,
};
