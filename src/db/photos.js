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

async function attachPhotosToProducts(products) {
  for (let product of products) {
    try {
      const { rows } = await db.query(
        `
          SELECT url 
          FROM photos
          WHERE "productId"=$1;
        `,
        [product.id]
      );

      product.photos = rows;
    } catch (error) {
      console.error(error);
    }
  }
}

module.exports = {
  createPhoto,
  attachPhotosToProducts,
};
