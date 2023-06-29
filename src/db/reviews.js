const { db } = require('../config/default');

async function createReview({ content, rate, productId, userId }) {
  try {
    const { rows } = await db.query(
      `
        INSERT INTO reviews (content ,rate ,"productId", "userId")
        VALUES ($1, $2, $3, $4)
        RETURNING *;
      `,
      [content, rate, productId, userId]
    );

    return rows[0];
  } catch (error) {
    console.error(error);
  }
}

async function getReviewsByProductId(productId) {
  try {
    const { rows } = await db.query(
      `
        SELECT reviews.id, reviews.content, reviews.rate ,reviews."userId", users.name 
        FROM reviews
        JOIN users ON users.id=reviews."userId"
        WHERE "productId"=$1;
      `,
      [productId]
    );
    if (rows <= 0) {
      return [];
    }

    return rows;
  } catch (error) {
    console.error(error);
  }
}

// async function attachReviewsToProducts(products) {
//   for (let product of products) {
//     try {
//       const { rows } = await db.query(
//         `
//           SELECT reviews.id, reviews.content, reviews."userId", users.email, users.name
//           FROM reviews
//           JOIN users ON reviews."userId"=users.id
//           WHERE "productId"=$1;
//         `,
//         [product.id]
//       );

//       product.reviews = rows;
//     } catch (error) {
//       console.error(error);
//     }
//   }
// }

async function deleteReviewsByProductId(productId) {
  try {
    await db.query(
      `
        DELETE FROM reviews
        WHERE "productId"=$1;
      `,
      [productId]
    );
  } catch (error) {
    console.error(error);
  }
}

module.exports = {
  createReview,
  getReviewsByProductId,
  deleteReviewsByProductId,
};
