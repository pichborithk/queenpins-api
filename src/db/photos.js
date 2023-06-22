const { db } = require('../config/default');

async function createPhoto(productId, url) {
  console.log(productId, url);
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

async function updatePhotosOfProduct(productId, urls) {
  try {
    await deletePhotosOfProduct(productId);

    if (urls.length > 0) {
      const photos = await Promise.all(
        urls.map(url => createPhoto(productId, url))
      );
      return photos;
    }

    return [];
  } catch (error) {
    console.error(error);
  }
}

async function deletePhotosOfProduct(productId) {
  try {
    await db.query(
      `
        DELETE FROM photos
        WHERE "productId"=$1;
      `,
      [productId]
    );
  } catch (error) {
    console.error(error);
  }
}

module.exports = {
  createPhoto,
  attachPhotosToProducts,
  updatePhotosOfProduct,
  deletePhotosOfProduct,
};
