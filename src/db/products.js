const { db } = require('../config/default');
const {
  getPicturesByProductId,
  deletePicturesByProductId,
} = require('./pictures');
const {
  getReviewsByProductId,
  deleteReviewsByProductId,
} = require('./reviews');

async function createProduct(fields) {
  const { title, description, price, quantity, type } = fields;
  try {
    const { rows } = await db.query(
      `
        INSERT INTO products (title, description, price, quantity, type)
        VALUES ($1, $2, $3, $4, $5)
        ON CONFLICT (title) DO NOTHING
        RETURNING *;
      `,
      [title, description, price, quantity, type]
    );

    return rows[0];
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

    const products = await Promise.all(
      rows.map(async product => {
        product.pictures = await getPicturesByProductId(product.id);
        product.reviews = await getReviewsByProductId(product.id);
        return product;
      })
    );

    return products;
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

    return rows[0];
  } catch (error) {
    console.error(error);
  }
}

async function deleteProduct(productId) {
  try {
    await deletePicturesByProductId(productId);
    await deleteReviewsByProductId(productId);

    const { rows } = await db.query(
      `
        DELETE FROM products
        WHERE id=$1
        RETURNING *;
      `,
      [productId]
    );

    return rows[0];
  } catch (error) {}
}

module.exports = {
  createProduct,
  getProducts,
  updateProduct,
  deleteProduct,
};
