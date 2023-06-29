const { db } = require('../config/default');

async function createPicture(productId, url) {
  try {
    const { rows } = await db.query(
      `
        INSERT INTO pictures (url, "productId")
        VALUES ($1, $2)
        RETURNING *;
      `,
      [url, productId]
    );

    return rows[0];
  } catch (error) {
    console.error(error);
  }
}

async function getPicturesByProductId(productId) {
  try {
    const { rows } = await db.query(
      `
        SELECT url 
        FROM pictures
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

// async function attachPhotosToProducts(products) {
//   for (let product of products) {
//     try {
//       const { rows } = await db.query(
//         `
//           SELECT url
//           FROM photos
//           WHERE "productId"=$1;
//         `,
//         [product.id]
//       );

//       product.photos = rows;
//     } catch (error) {
//       console.error(error);
//     }
//   }
// }

async function updatePicturesByProductId(productId, urls) {
  try {
    await deletePicturesByProductId(productId);

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

async function deletePicturesByProductId(productId) {
  try {
    await db.query(
      `
        DELETE FROM pictures
        WHERE "productId"=$1;
      `,
      [productId]
    );
  } catch (error) {
    console.error(error);
  }
}

module.exports = {
  createPicture,
  getPicturesByProductId,
  updatePicturesByProductId,
  deletePicturesByProductId,
};
