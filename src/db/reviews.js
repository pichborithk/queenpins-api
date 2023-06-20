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
    throw error;
  }
}

module.exports = {
  createReview,
};
