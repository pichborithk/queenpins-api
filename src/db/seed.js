const { pool } = require('../config/default');
const { faker } = require('@faker-js/faker');
const { product_list, user_list } = require('./dummy_data');
const { createPicture } = require('./pictures');
const { createProduct } = require('./products');
const { createUser, updateUser } = require('./users');
const { createReview } = require('./reviews');

async function dropTables() {
  try {
    console.log('Dropping All Tables...');

    const db = await pool.connect();
    await db.query(`

    DROP TABLE IF EXISTS carts;
    DROP TABLE IF EXISTS pictures;
    DROP TABLE IF EXISTS reviews;
    DROP TABLE IF EXISTS products;
    DROP TABLE IF EXISTS users;
    DROP TYPE IF EXISTS user_type;

    `);
    db.release(true);

    console.log('Finished dropping tables!');
  } catch (error) {
    console.error('Error while dropping tables!');
  }
}

async function buildTables() {
  try {
    console.log('Starting to construct tables...');

    const db = await pool.connect();
    await db.query(`
      CREATE TYPE user_type AS ENUM ('user', 'admin');

      CREATE TABLE users(
        id SERIAL PRIMARY KEY,
        email VARCHAR(255) UNIQUE NOT NULL,
        name VARCHAR(255) NOT NULL,
        type user_type DEFAULT 'user' NOT NULL,
        password VARCHAR(255)  NOT NULL
      );

      CREATE TABLE products(
        id SERIAL PRIMARY KEY,
        title VARCHAR(255) UNIQUE NOT NULL,
        description TEXT NOT NULL,
        price MONEY NOT NULL,
        quantity INTEGER NOT NULL,
        type VARCHAR(255) NOT NULL
      );

      CREATE TABLE pictures(
        id SERIAL PRIMARY KEY,
        url text NOT NULL,
        "productId" INTEGER REFERENCES products(id)
      );

      CREATE TABLE reviews(
        id SERIAL PRIMARY KEY,
        content text NOT NULL,
        rate SMALLINT NOT NULL,
        "productId" INTEGER REFERENCES products(id),
        "userId" INTEGER 	REFERENCES users(id)
      );

      CREATE TABLE carts(
        id SERIAL PRIMARY KEY,
        "productId" INTEGER REFERENCES products(id),
        "userId" INTEGER 	REFERENCES users(id),
        quantity INTEGER NOT NULL,
        UNIQUE ("productId", "userId")
      );
    `);
    db.release(true);

    console.log('Finished constructing tables!');
  } catch (error) {
    console.error('Error constructing tables!');
  }
}

async function rebuildDatabase() {
  try {
    await dropTables();
    await buildTables();
  } catch (error) {
    console.log('Error during rebuildDB');
    throw error;
  }
}

async function initialData() {
  try {
    console.log('Starting adding data...');

    const users = await Promise.all(user_list.map(user => createUser(user)));

    const products = await Promise.all(
      product_list.map(product => createProduct(product))
    );

    await Promise.all(
      products.map(product => createPicture(product.id, faker.image.url()))
    );

    await Promise.all(
      products.map(product => createPicture(product.id, faker.image.url()))
    );

    await Promise.all(
      products.map(product => createPicture(product.id, faker.image.url()))
    );

    await Promise.all(
      products.map(async product => {
        const productId = product.id;
        const userId = users[Math.floor(Math.random() * users.length)].id;
        const content = faker.lorem.paragraph({ min: 1, max: 3 });
        const rate = Math.round(Math.random() * 5);
        return await createReview({ content, rate, productId, userId });
      })
    );

    await Promise.all(
      products.map(async product => {
        const productId = product.id;
        const userId = users[Math.floor(Math.random() * users.length)].id;
        const content = faker.lorem.paragraph({ min: 1, max: 3 });
        const rate = Math.round(Math.random() * 5);
        return await createReview({ content, rate, productId, userId });
      })
    );

    await Promise.all(
      products.map(async product => {
        const productId = product.id;
        const userId = users[Math.floor(Math.random() * users.length)].id;
        const content = faker.lorem.paragraph({ min: 1, max: 3 });
        const rate = Math.round(Math.random() * 5);
        return await createReview({ content, rate, productId, userId });
      })
    );

    const adminUser = await createUser({
      email: 'admin',
      name: 'Admin',
      password: '123',
    });

    await updateUser({ id: adminUser.id, type: 'admin' });

    console.log('Finished adding data...');
  } catch (error) {
    console.log('Error adding data...');
  }
}

module.exports = {
  rebuildDatabase,
  initialData,
};
