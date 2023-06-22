const { db } = require('../config/default');
const { createPhoto, attachPhotosToProducts } = require('./photos');
const { attachReviewsToProducts } = require('./reviews');

async function createProduct(fields) {
  const { name, description, price, quantity, urls } = fields;
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
    product.photos = [];

    if (urls.length > 0) {
      const photos = await Promise.all(
        urls.map(url => createPhoto(product.id, url))
      );
      product.photos = photos;
    }

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

module.exports = {
  createProduct,
  getProducts,
};
