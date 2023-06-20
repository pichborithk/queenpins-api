const { db } = require('../config/default');
const { createPhoto } = require('./photos');

async function createPost(fields) {
  const { name, description, price, quantity, urls } = fields;
  try {
    const { rows } = await db.query(
      `
        INSERT INTO posts (name, description, price, quantity)
        VALUES ($1, $2, $3, $4)
        ON CONFLICT (name) DO NOTHING
        RETURNING *;
      `,
      [name, description, price, quantity]
    );

    const [product] = rows;
    if (urls.length > 0) {
      const photos = await Promise.all(
        urls.map(url => createPhoto(product.id, url))
      );
      product.photos = photos;
    }

    return product;
  } catch (error) {
    throw error;
  }
}

module.exports = {
  createPost,
};
