const { db } = require('../config/default');

async function createPhoto(productId, url) {
  try {
    const { rows } = await db.query(
      `
        INSERT INTO photos (url, "productId")
        VALUES ($1, $2)
        RETURNING *;
      `,
      [url, productId]
    );

    const [photo] = rows;
    return photo;
  } catch (error) {
    console.error(error);
  }
}

module.exports = {
  createPhoto,
};
