const { db } = require('../config/default');

async function createReview({ content, productId, userId }) {
  try {
    const { rows } = await db.query(
      `
        INSERT INTO reviews (content, "productId", "userId")
        VALUES ($1, $2, $3)
        RETURNING *;
      `,
      [content, productId, userId]
    );

    const [review] = rows;
    return review;
  } catch (error) {
    console.error(error);
  }
}

async function attachReviewsToProducts(products) {
  for (let product of products) {
    try {
      const { rows } = await db.query(
        `
          SELECT reviews.id, reviews.content, reviews."userId", users.email, users.name
          FROM reviews
          JOIN users ON reviews."userId"=users.id
          WHERE "productId"=$1;
        `,
        [product.id]
      );

      product.reviews = rows;
    } catch (error) {
      console.error(error);
    }
  }
}

module.exports = {
  createReview,
  attachReviewsToProducts,
};
